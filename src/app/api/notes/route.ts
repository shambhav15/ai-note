import { auth } from "@clerk/nextjs/server";
import {
  createNotesSchema,
  deleteNotesSchema,
  updateNotesSchema,
} from "../../../../prisma/validation/note";
import prisma from "../../../../prisma/client/db";
import crypto from "crypto";
import { getEmbedding } from "@/lib/openai";
import { noteIndex } from "@/lib/pineCone";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = createNotesSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { title, content } = parseResult.data;
    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hashedUserId = crypto
      .createHash("md5")
      .update(userId)
      .digest("hex")
      .substring(0, 24);

    // Transaction for embedding and note creation in mongoDB2
    const embedding = await getEmbeddingForNotes(title, content);

    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.create({
        data: {
          title,
          content,
          userId: hashedUserId,
        },
      });

      await noteIndex.upsert([
        {
          id: note.id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return note;
    });

    return Response.json(note, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Something went wrong from routes" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parseResult = updateNotesSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id, title, content } = parseResult.data;

    const notee = await prisma.note.findUnique({ where: { id } });
    if (!notee) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    const { userId } = auth();

    const hashedUserId = crypto
      .createHash("md5")
      .update(userId!)
      .digest("hex")
      .substring(0, 24);

    if (!userId || hashedUserId !== notee.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embedding = await getEmbeddingForNotes(title, content);

    const updatedNote = await prisma.$transaction(async (tx) => {
      const updatedNote = await tx.note.update({
        where: { id },
        data: {
          title,
          content,
        },
      });

      await noteIndex.upsert([
        {
          id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return updatedNote;
    });

    return Response.json(updatedNote, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parseResult = deleteNotesSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;

    const notee = await prisma.note.findUnique({ where: { id } });
    if (!notee) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    const { userId } = auth();
    const hashedUserId = crypto
      .createHash("md5")
      .update(userId!)
      .digest("hex")
      .substring(0, 24);

    if (!userId || hashedUserId !== notee.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.note.delete({
        where: { id },
      });

      await noteIndex.deleteOne(id);
    });

    return Response.json({ message: "Note deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export function getEmbeddingForNotes(
  title: string,
  content: string | undefined
) {
  return getEmbedding(title + "\n\n" + content ?? "");
}

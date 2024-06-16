import { getEmbedding } from "@/lib/openai";
import { noteIndex } from "@/lib/pineCone";
import { auth } from "@clerk/nextjs/server";
import prisma from "../../../../prisma/client/db";
import { streamText, CoreMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: CoreMessage[] } = await req.json();

    const messageTruncated = messages.slice(-6);

    // Get embedding for the truncated messages
    const embedding = await getEmbedding(
      messageTruncated.map((message) => message.content).join(" \n")
    );

    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query the PineCone index
    const vectorQueryResponse = await noteIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId },
    });

    // Fetch relevant notes from the database
    const relevantNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((result) => result.id),
        },
      },
    });
    console.log("Relevant notes found", relevantNotes);

    // Construct the system message
    const sysMessage: CoreMessage = {
      role: "assistant",
      content:
        "You are an Intelligent Note Taking app. You answer the questions to user based on their existing notes. The relevant notes for this query are:\n" +
        relevantNotes
          .map((note) => `Title: ${note.title}\n\nContent: ${note.content}`)
          .join("\n\n"),
    };

    // Call the language model
    const result = await streamText({
      model: openai("gpt-3.5-turbo"),
      messages: [sysMessage, ...messageTruncated],
    });

    return result.toAIStreamResponse();
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

import React from "react";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import prisma from "../../../prisma/client/db";
import crypto from "crypto";
import NoteLayout from "@/components/NoteLayout";

const Notespage = async () => {
  const { userId } = auth();
  if (!userId) throw error("userid undefined");
  const hashedUserId = crypto
    .createHash("md5")
    .update(userId)
    .digest("hex")
    .substring(0, 24);

  const allNotes = await prisma.note.findMany({
    where: { userId: hashedUserId },
  });

  return (
    <div className="grid gap-3 sm:grif-cols-2 lg:grid-cols-3">
      {allNotes.map((note) => (
        <NoteLayout note={note} key={note.id} />
      ))}
      {allNotes.length === 0 && (
        <p className="text-center col-span-full">No notes yet</p>
      )}
    </div>
  );
};

export default Notespage;

export const metadata: Metadata = {
  title: "NoteSage - notes",
};

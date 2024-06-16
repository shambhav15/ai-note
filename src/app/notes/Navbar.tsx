"use client";
import AddEditNoteDialog from "@/components/AddEditNoteDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { PlusIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import React, { use, useState } from "react";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import AIButton from "@/components/AIButton";

const Navbar = () => {
  const { theme } = useTheme();
  const [showDialog, setShowDialog] = useState(false);
  return (
    <div className="p-4 shadow">
      <div className="max-w-7xl flex m-auto flex-wrap gap-3 items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          <Image src="/logo.png" alt="NoteSage" width={50} height={50} />
          <span className="font-bold">NoteSage</span>
        </Link>
        <div className="flex items-center gap-2">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
              elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } },
            }}
          />
          <ThemeToggleButton />
          <Button onClick={() => setShowDialog(true)}>
            <PlusIcon fontSize={20} className="mr-2" />
            Add Note
          </Button>
          <AIButton />
        </div>
      </div>
      <AddEditNoteDialog open={showDialog} setOpen={setShowDialog} />
    </div>
  );
};

export default Navbar;

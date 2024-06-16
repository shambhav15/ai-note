import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { userId } = auth();
  if (userId) redirect("/notes");
  return (
    <main className="flex h-screen items-center justify-center flex-col gap-5">
      <div className="flex items-center gap-4 ">
        <Link href="/" className="flex items-center gap-1">
          <Image src="/logo.png" alt="NoteSage" width={50} height={50} />
          <span className="font-extrabold tracking-tight text-4xl lg:text-5xl">
            NoteSage
          </span>
        </Link>
      </div>
      <p className="text-center max-w-prose">
        An intellegent note-taking app with AI integration, built with openAI
      </p>
      <Button asChild>
        <Link href="/notes">Notes</Link>
      </Button>
      
    </main>
  );
}

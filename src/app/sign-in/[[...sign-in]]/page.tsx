import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn appearance={{ variables: { colorPrimary: "#0F172A" } }} />
    </div>
  );
}



export const metadata: Metadata = {
  title: "NoteSage - signin",
};
import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export default function Page() {
  return (
    <div className="flex h-screen item-center justify-center">
      <SignUp  appearance={{variables: {colorPrimary: "#0F172A"}}}/>;
    </div>
  );
}


export const metadata: Metadata = {
  title: "NoteSage - signup",
};
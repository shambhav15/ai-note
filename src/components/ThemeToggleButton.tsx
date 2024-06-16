import { useTheme } from "next-themes";
import React from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="rounded-full"
      >
        <Sun className="w-6 h-6 rotate-0 scale-100 duration-500 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute w-6 h-6 duration-500 rotate-90 dark:rotate-0 scale-0 translate-all dark:scale-100" />
        <p className="sr-only">Toggle Theme</p>
      </Button>
    </>
  );
};

export default ThemeToggleButton;

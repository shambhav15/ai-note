"use client";

import { useState } from "react";
import AiChatBot from "./AiChatBot";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";

const AIButton = () => {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <>
      <Button className="gap-2" onClick={() => setChatOpen(true)}>
        <Bot size={20} />
        Ai Chat
      </Button>
      <AiChatBot open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
};

export default AIButton;

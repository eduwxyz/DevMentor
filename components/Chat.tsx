import { Message } from "@/types";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useEffect, useRef } from "react";

interface ChatProps {
    messages: Message[];
    isLoading: boolean;
    onSendMessage: (content: string) => void;
}

export default function Chat({ messages, isLoading, onSendMessage }: ChatProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    return (
        <div className="flex flex-col flex-1 h-[calc(100vh-112px)] md:h-[calc(100vh-56px)] bg-background">
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}

                    {isLoading && (
                        <div className="flex justify-start w-full">
                            <div className="flex gap-3 max-w-[85%]">
                                <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-1">
                                    <span className="text-xs font-bold text-accent">TL</span>
                                </div>
                                <div className="bg-background-secondary border border-border p-4 rounded-xl rounded-tl-sm">
                                    <div className="flex gap-1.5 h-full items-center">
                                        <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
        </div>
    );
}

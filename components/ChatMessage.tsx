import { Message } from "@/types";

interface ChatMessageProps {
    message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
    const isAssistant = message.role === "assistant";

    return (
        <div className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"}`}>
            <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${isAssistant ? "flex-row" : "flex-row-reverse"}`}>

                {/* Avatar (only for assistant) */}
                {isAssistant && (
                    <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-1">
                        <span className="text-xs font-bold text-accent">TL</span>
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    {isAssistant && (
                        <span className="text-xs text-text-tertiary ml-1">Tech Lead</span>
                    )}

                    <div className={`p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${isAssistant
                            ? "bg-background-secondary text-text-primary rounded-tl-sm border border-border"
                            : "bg-accent text-white rounded-tr-sm"
                        }`}>
                        {message.content}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
    onSendMessage: (content: string) => void;
    isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (message.trim() && !isLoading) {
            onSendMessage(message);
            setMessage("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
        }
    }, [message]);

    return (
        <div className="border-t border-border bg-background-secondary p-4 md:p-6 shrink-0">
            <form
                onSubmit={handleSubmit}
                className="flex gap-4 items-end max-w-4xl mx-auto"
            >
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Digite sua mensagem..."
                        disabled={isLoading}
                        className="w-full bg-background-tertiary text-text-primary border border-border rounded-lg px-4 py-3 min-h-[48px] max-h-[120px] focus:outline-none focus:border-accent resize-none placeholder:text-text-tertiary"
                        rows={1}
                    />
                </div>
                <button
                    type="submit"
                    disabled={!message.trim() || isLoading}
                    className="h-[48px] w-[48px] rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
}

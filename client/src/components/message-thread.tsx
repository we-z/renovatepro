import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft } from "lucide-react";
import { authService } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@shared/schema";

interface MessageThreadProps {
  projectId: number;
  otherUserId: number;
  otherUserName: string;
  projectTitle: string;
  messages: (Message & {
    sender?: any;
    receiver?: any;
  })[];
  onBack?: () => void;
  onNewMessage?: (message: Message) => void;
}

export function MessageThread({
  projectId,
  otherUserId,
  otherUserName,
  projectTitle,
  messages,
  onBack,
  onNewMessage,
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const authState = authService.getState();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !authState.user) return;

    setIsLoading(true);
    try {
      const messageData = {
        projectId,
        senderId: authState.user.id,
        receiverId: otherUserId,
        content: newMessage.trim(),
      };

      const response = await apiRequest("POST", "/api/messages", messageData);
      const message = await response.json();

      if (onNewMessage) {
        onNewMessage(message);
      }

      setNewMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been delivered.",
      });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date | string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      return messageDate.toLocaleTimeString([], { 
        hour: "2-digit", 
        minute: "2-digit" 
      });
    } else {
      return messageDate.toLocaleDateString([], { 
        month: "short", 
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "U";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="border-b border-neutral-200">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex-1">
            <CardTitle className="text-lg">{otherUserName}</CardTitle>
            <p className="text-sm text-neutral-600">{projectTitle}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-neutral-600">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => {
                const isCurrentUser = message.senderId === authState.user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[70%] ${
                        isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-medium">
                          {isCurrentUser
                            ? getInitials(authState.user?.firstName, authState.user?.lastName)
                            : getInitials(message.sender?.firstName, message.sender?.lastName)
                          }
                        </span>
                      </div>
                      <div
                        className={`rounded-lg px-3 py-2 ${
                          isCurrentUser
                            ? "bg-primary text-white"
                            : "bg-neutral-100 text-neutral-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isCurrentUser ? "text-blue-100" : "text-neutral-500"
                          }`}
                        >
                          {formatTime(message.createdAt!)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t border-neutral-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

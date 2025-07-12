import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { SubscriptionGuard } from "@/components/subscription-guard";
import { MessageThread } from "@/components/message-thread";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  MessageCircle, 
  User, 
  Calendar,
  ArrowLeft
} from "lucide-react";
import { authService } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface ConversationSummary {
  projectId: number;
  projectTitle: string;
  otherUserId: number;
  otherUserName: string;
  otherUserType: string;
  lastMessage?: any;
  unreadCount: number;
  lastActivity: Date;
}

export default function Messages() {
  const [authState, setAuthState] = useState(authService.getState());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<ConversationSummary | null>(null);
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    return authService.subscribe(setAuthState);
  }, []);

  // Fetch user's projects to get potential conversations
  const { data: userProjects = [] } = useQuery({
    queryKey: authState.user?.userType === "homeowner" 
      ? ["/api/users", authState.user?.id, "projects"]
      : ["/api/projects"],
    enabled: !!authState.user,
  });

  // Fetch contractor bids if user is a contractor
  const { data: contractorBids = [] } = useQuery({
    queryKey: ["/api/contractors", authState.contractor?.id, "bids"],
    enabled: !!authState.contractor,
  });

  // Get project-based conversations
  const getConversations = (): ConversationSummary[] => {
    const conversations: ConversationSummary[] = [];

    if (authState.user?.userType === "homeowner") {
      // For homeowners, create conversations based on their projects and accepted bids
      userProjects.forEach((project: any) => {
        // This would normally fetch actual bids and messages
        // For now, we'll create placeholder conversations
        const conversation: ConversationSummary = {
          projectId: project.id,
          projectTitle: project.title,
          otherUserId: 0, // Would be contractor's user ID
          otherUserName: "Contractor", // Would be actual contractor name
          otherUserType: "contractor",
          unreadCount: 0,
          lastActivity: new Date(project.updatedAt || project.createdAt),
        };
        conversations.push(conversation);
      });
    } else {
      // For contractors, create conversations based on their accepted bids
      contractorBids
        .filter((bid: any) => bid.status === "accepted")
        .forEach((bid: any) => {
          const conversation: ConversationSummary = {
            projectId: bid.project?.id || 0,
            projectTitle: bid.project?.title || "Unknown Project",
            otherUserId: bid.project?.homeowner?.id || 0,
            otherUserName: `${bid.project?.homeowner?.firstName || ''} ${bid.project?.homeowner?.lastName || ''}`.trim() || "Homeowner",
            otherUserType: "homeowner",
            unreadCount: 0,
            lastActivity: new Date(bid.createdAt),
          };
          conversations.push(conversation);
        });
    }

    return conversations.sort((a, b) => 
      new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    );
  };

  const conversations = getConversations();

  const filteredConversations = conversations.filter((conversation) =>
    conversation.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.otherUserName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch messages for selected conversation
  const { data: messages = [] } = useQuery({
    queryKey: ["/api/projects", selectedConversation?.projectId, "messages"],
    enabled: !!selectedConversation,
  });

  useEffect(() => {
    if (selectedConversation && messages) {
      setConversationMessages(messages);
    }
  }, [selectedConversation, messages]);

  const handleConversationSelect = (conversation: ConversationSummary) => {
    setSelectedConversation(conversation);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const handleNewMessage = (message: any) => {
    setConversationMessages(prev => [...prev, message]);
  };

  const formatTime = (date: Date | string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    if (diffHours < 1) {
      return "Just now";
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`;
    } else if (diffDays < 7) {
      return `${Math.floor(diffDays)}d ago`;
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <SubscriptionGuard feature="messaging">
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Messages</h1>
          <p className="text-neutral-600">
            Communicate with {authState.user?.userType === "homeowner" ? "contractors" : "homeowners"} about your projects
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
          {/* Conversations List */}
          <Card className={`${selectedConversation ? 'hidden lg:block' : ''}`}>
            <CardHeader className="border-b border-neutral-200">
              <CardTitle className="flex items-center justify-between">
                <span>Conversations</span>
                <Badge variant="secondary">{conversations.length}</Badge>
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[550px]">
                {filteredConversations.length === 0 ? (
                  <div className="p-6 text-center">
                    <MessageCircle className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                    <p className="text-neutral-600 mb-2">No conversations yet</p>
                    <p className="text-sm text-neutral-500">
                      {authState.user?.userType === "homeowner" 
                        ? "Messages will appear here when contractors bid on your projects"
                        : "Messages will appear here when your bids are accepted"
                      }
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-200">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={`${conversation.projectId}-${conversation.otherUserId}`}
                        className={`p-4 cursor-pointer hover:bg-neutral-50 transition-colors ${
                          selectedConversation?.projectId === conversation.projectId &&
                          selectedConversation?.otherUserId === conversation.otherUserId
                            ? "bg-blue-50 border-r-2 border-primary"
                            : ""
                        }`}
                        onClick={() => handleConversationSelect(conversation)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-medium">
                              {getInitials(conversation.otherUserName)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-neutral-900 truncate">
                                {conversation.otherUserName}
                              </p>
                              <div className="flex items-center space-x-2">
                                {conversation.unreadCount > 0 && (
                                  <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                                <span className="text-xs text-neutral-500">
                                  {formatTime(conversation.lastActivity)}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-neutral-600 truncate mb-1">
                              {conversation.projectTitle}
                            </p>
                            {conversation.lastMessage && (
                              <p className="text-xs text-neutral-500 truncate">
                                {conversation.lastMessage.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Message Thread */}
          <div className={`lg:col-span-2 ${!selectedConversation ? 'hidden lg:block' : ''}`}>
            {selectedConversation ? (
              <MessageThread
                projectId={selectedConversation.projectId}
                otherUserId={selectedConversation.otherUserId}
                otherUserName={selectedConversation.otherUserName}
                projectTitle={selectedConversation.projectTitle}
                messages={conversationMessages}
                onBack={handleBackToList}
                onNewMessage={handleNewMessage}
              />
            ) : (
              <Card className="h-full">
                <CardContent className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-neutral-600">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      </div>
    </SubscriptionGuard>
  );
}

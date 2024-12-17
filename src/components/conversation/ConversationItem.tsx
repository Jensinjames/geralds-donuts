import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface ConversationItemProps {
  id: string;
  userMessage: string;
  agentResponse: string;
  timestamp: string;
}

export function ConversationItem({ userMessage, agentResponse, timestamp }: ConversationItemProps) {
  return (
    <Card className="p-4 card-hover">
      <div className="flex items-start space-x-3">
        <MessageSquare className="w-5 h-5 text-muted-foreground mt-1" />
        <div className="space-y-2 w-full">
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">User Message:</p>
            <p className="mt-1">{userMessage}</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Agent Response:</p>
            <p className="mt-1">{agentResponse}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
}
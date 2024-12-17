import { useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useConversations } from "@/hooks/useConversations";
import { ConversationItem } from "./conversation/ConversationItem";
import { ConversationLoading } from "./conversation/ConversationLoading";
import { EmptyConversation } from "./conversation/EmptyConversation";

export function ConversationHistory() {
  const { toast } = useToast();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const { data: conversations, isLoading, error } = useConversations();

  useEffect(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    channelRef.current = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_history'
        },
        (payload) => {
          console.log('New conversation:', payload);
          toast({
            title: "New Conversation",
            description: "A new conversation has been added",
          });
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [toast]);

  if (error) {
    console.error('Query error:', error);
    return (
      <div className="p-4 text-red-500">
        Error loading conversations. Please check the console for details.
      </div>
    );
  }

  if (isLoading) {
    return <ConversationLoading />;
  }

  if (!conversations || conversations.length === 0) {
    return <EmptyConversation />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Conversation History</h2>
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          id={conversation.id}
          userMessage={conversation.user_message}
          agentResponse={conversation.agent_response}
          timestamp={conversation.timestamp || new Date().toISOString()}
        />
      ))}
    </div>
  );
}
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

export function ConversationHistory() {
  const { toast } = useToast();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      console.log('Fetching conversations...');
      const { data, error } = await supabase
        .from('conversation_history')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched conversations:', data);
      return data;
    },
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    cacheTime: 1000 * 60 * 5, // Keep unused data in cache for 5 minutes
  });

  useEffect(() => {
    // Clean up previous subscription if it exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create new subscription
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
    return (
      <Card className="p-6 shimmer">
        <div className="h-20 bg-muted rounded-md"></div>
      </Card>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          No conversations found. Start a voice chat to create some!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Conversation History</h2>
      {conversations?.map((conversation) => (
        <Card key={conversation.id} className="p-4 card-hover">
          <div className="flex items-start space-x-3">
            <MessageSquare className="w-5 h-5 text-muted-foreground mt-1" />
            <div className="space-y-2 w-full">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">User Message:</p>
                <p className="mt-1">{conversation.user_message}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Agent Response:</p>
                <p className="mt-1">{conversation.agent_response}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(conversation.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
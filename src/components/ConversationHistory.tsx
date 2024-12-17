import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export function ConversationHistory() {
  const { toast } = useToast();
  const { data: conversations, isLoading, refetch } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversation_history')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    // Subscribe to real-time updates
    const channel = supabase
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
          refetch(); // Refresh the conversation list
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, toast]);

  if (isLoading) {
    return (
      <Card className="p-6 shimmer">
        <div className="h-20 bg-muted rounded-md"></div>
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
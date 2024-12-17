import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useConversations() {
  return useQuery({
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
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
}
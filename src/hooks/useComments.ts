import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useComments() {
  return useQuery({
    queryKey: ['comments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      return data;
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
}
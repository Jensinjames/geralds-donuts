import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useActivities() {
  return useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      console.log('Fetching activities...');
      const { data, error } = await supabase
        .from('Activity')
        .select('*')
        .order('Timestamp', { ascending: false });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched activities:', data);
      return data;
    },
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}
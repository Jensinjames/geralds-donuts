import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";

export function ActivityList() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Activity')
        .select('*')
        .order('Timestamp', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6 shimmer">
        <div className="h-20 bg-muted rounded-md"></div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
      {activities?.map((activity) => (
        <Card key={activity.ID} className="p-4 card-hover">
          <div className="flex items-start space-x-3">
            <Activity className="w-5 h-5 text-muted-foreground mt-1" />
            <div>
              <p className="text-sm text-muted-foreground">User: {activity.User}</p>
              <p className="font-medium">{activity.Action}</p>
              <p className="text-sm mt-1">{JSON.stringify(activity.Details)}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(activity.Timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
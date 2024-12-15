import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export function Comments() {
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });
      
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
      <h2 className="text-2xl font-bold mb-4">Recent Comments</h2>
      {comments?.map((comment) => (
        <Card key={comment.id} className="p-4 card-hover">
          <div className="flex items-start space-x-3">
            <MessageSquare className="w-5 h-5 text-muted-foreground mt-1" />
            <div>
              <p className="text-sm text-muted-foreground">User: {comment.user_id}</p>
              <p className="mt-1">{comment.content}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(comment.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
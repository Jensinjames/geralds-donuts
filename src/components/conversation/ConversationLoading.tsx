import { Card } from "@/components/ui/card";

export function ConversationLoading() {
  return (
    <Card className="p-6 shimmer">
      <div className="h-20 bg-muted rounded-md"></div>
    </Card>
  );
}
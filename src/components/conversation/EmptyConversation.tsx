import { Card } from "@/components/ui/card";

export function EmptyConversation() {
  return (
    <Card className="p-6">
      <p className="text-center text-muted-foreground">
        No conversations found. Start a voice chat to create some!
      </p>
    </Card>
  );
}
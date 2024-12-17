import { Card } from "@/components/ui/card";

export function ApiEndpoints() {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Available Endpoints</h3>
      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-md">
          <p className="font-mono text-sm">POST /functions/elevenlabs-webhook</p>
          <p className="text-sm text-muted-foreground mt-2">Webhook endpoint for ElevenLabs conversation history</p>
        </div>
        <div className="p-4 bg-muted rounded-md">
          <p className="font-mono text-sm">GET /api/comments</p>
          <p className="text-sm text-muted-foreground mt-2">Fetch comments</p>
        </div>
        <div className="p-4 bg-muted rounded-md">
          <p className="font-mono text-sm">GET /api/activity</p>
          <p className="text-sm text-muted-foreground mt-2">Fetch activity logs</p>
        </div>
      </div>
    </Card>
  );
}
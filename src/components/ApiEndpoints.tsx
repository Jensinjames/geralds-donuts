import { Card } from "@/components/ui/card";
import { ApiTest } from "./ApiTest";

export function ApiEndpoints() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Available Endpoints</h3>
        <ApiTest />
      </div>
      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-md">
          <p className="font-mono text-sm">POST /functions/elevenlabs-webhook</p>
          <p className="text-sm text-muted-foreground mt-2">Webhook endpoint for ElevenLabs conversation history</p>
        </div>
        <div className="p-4 bg-muted rounded-md">
          <p className="font-mono text-sm">GET /functions/get-elevenlabs-url</p>
          <p className="text-sm text-muted-foreground mt-2">Get signed URL for ElevenLabs conversation</p>
        </div>
      </div>
    </Card>
  );
}
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export const ApiTest = () => {
  const { toast } = useToast();

  const testWebhook = async () => {
    try {
      const { data: postResponse, error: postError } = await supabase.functions.invoke('elevenlabs-webhook', {
        method: 'POST',
        body: {
          url: "https://api.elevenlabs.io/v1/history/123",
          input: "What's the weather like?",
          output: "The weather is sunny today.",
          metadata: {
            timestamp: new Date().toISOString(),
            session_id: "session-123",
            model_id: "eleven_turbo",
            char_count: 50
          }
        }
      });

      if (postError) throw postError;
      console.log('Webhook response:', postResponse);

      toast({
        title: "Webhook Test Successful",
        description: "Check the console for response data",
      });
    } catch (error) {
      console.error('Webhook test error:', error);
      toast({
        title: "Webhook Test Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Button onClick={testWebhook} variant="outline">
      Test Webhook
    </Button>
  );
};
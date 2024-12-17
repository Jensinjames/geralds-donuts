import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export const ApiTest = () => {
  const { toast } = useToast();

  const testWebhook = async () => {
    try {
      // Test GET request
      const { data: getResponse, error: getError } = await supabase.functions.invoke('elevenlabs-webhook', {
        method: 'GET'
      });

      if (getError) throw getError;
      console.log('GET response:', getResponse);
      
      // Test POST request with sample data
      const { data: postResponse, error: postError } = await supabase.functions.invoke('elevenlabs-webhook', {
        method: 'POST',
        body: {
          conversation_id: 'test-123',
          user_message: 'Hello, this is a test message',
          agent_response: 'This is a test response from the webhook',
          metadata: {
            test: true,
            timestamp: new Date().toISOString()
          }
        }
      });

      if (postError) throw postError;
      console.log('POST response:', postResponse);

      toast({
        title: "Webhook Test Successful",
        description: "Check the console and dashboard for test data",
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
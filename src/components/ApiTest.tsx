import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const ApiTest = () => {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const testWebhook = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to test the API integration",
        variant: "destructive"
      });
      return;
    }

    try {
      // First, log the activity with the actual user ID
      const { error: activityError } = await supabase
        .from('Activity')
        .insert({
          ID: crypto.randomUUID(),
          Timestamp: new Date().toISOString(),
          User: userId,
          Action: 'TEST_WEBHOOK',
          Details: { test: true },
          Status: 'success',
          Source: 'api-test'
        });

      if (activityError) throw activityError;

      // Then test the webhook
      const { data: postResponse, error: postError } = await supabase.functions.invoke('elevenlabs-webhook', {
        method: 'POST',
        body: {
          url: "https://api.elevenlabs.io/v1/history/test-123",
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
        title: "Test Successful",
        description: "Activity logged and webhook tested successfully",
      });
    } catch (error) {
      console.error('Test error:', error);
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      onClick={testWebhook} 
      variant="outline"
      disabled={!userId}
    >
      Test API Integration
    </Button>
  );
};
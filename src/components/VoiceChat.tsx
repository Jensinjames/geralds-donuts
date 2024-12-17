import { useConversation } from "@11labs/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function VoiceChat() {
  const { toast } = useToast();
  const [isReady, setIsReady] = useState(false);
  const conversation = useConversation({
    onConnect: () => {
      toast({
        title: "Connected",
        description: "Voice chat is now connected",
      });
    },
    onDisconnect: () => {
      toast({
        title: "Disconnected",
        description: "Voice chat has been disconnected",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error, // Changed from error.message to error
        variant: "destructive",
      });
    },
    onMessage: (message) => {
      console.log("New message:", message);
    },
  });

  useEffect(() => {
    // Request microphone permission when component mounts
    const setupMicrophone = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsReady(true);
      } catch (error) {
        toast({
          title: "Microphone Error",
          description: "Please allow microphone access to use voice chat",
          variant: "destructive",
        });
      }
    };

    setupMicrophone();
  }, [toast]);

  const startChat = async () => {
    try {
      // Get signed URL from ElevenLabs API
      const response = await fetch(
        "https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=f5VcNFddXJbBfZz1xvA8",
        {
          headers: {
            "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get signed URL");
      }

      const data = await response.json();
      await conversation.startSession({ signedUrl: data.signed_url }); // Changed from url to signedUrl
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start voice chat",
        variant: "destructive",
      });
    }
  };

  const stopChat = async () => {
    await conversation.endSession();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button
          onClick={startChat}
          disabled={!isReady || conversation.status === "connected"}
        >
          Start Voice Chat
        </Button>
        <Button
          onClick={stopChat}
          disabled={conversation.status !== "connected"}
          variant="outline"
        >
          Stop Voice Chat
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        <p>Status: {conversation.status}</p>
        <p>
          Agent is{" "}
          {conversation.isSpeaking ? (
            <span className="text-green-500">speaking</span>
          ) : (
            <span className="text-blue-500">listening</span>
          )}
        </p>
      </div>
    </div>
  );
}
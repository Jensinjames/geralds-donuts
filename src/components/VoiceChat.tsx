import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function VoiceChat() {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetInitialized = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeWidget = async () => {
      if (widgetInitialized.current) return;
      setIsLoading(true);

      try {
        // Clean up any existing widget instances
        const existingWidget = document.querySelector('elevenlabs-convai');
        if (existingWidget) {
          existingWidget.remove();
        }

        // Create the new widget
        const widget = document.createElement('elevenlabs-convai');
        
        // Get the signed URL from our Edge Function
        const { data: { signedUrl }, error } = await supabase.functions.invoke('get-elevenlabs-url');
        
        if (error) {
          throw new Error('Failed to get signed URL');
        }

        // Set widget attributes
        widget.setAttribute('url', signedUrl);
        
        // Set widget configuration
        const config = {
          conversation_config_override: {
            agent: {
              prompt: {
                prompt: "You are a helpful AI assistant. You are cheerful and friendly."
              },
              first_message: "Hi! How can I help you today?",
              language: "en"
            },
            tts: {
              voice_id: "pNInz6obpgDQGcFmaJgB"
            }
          },
          custom_llm_extra_body: {
            temperature: 0.7,
            max_tokens: 150
          }
        };
        
        widget.setAttribute('config', JSON.stringify(config));
        
        if (containerRef.current) {
          containerRef.current.appendChild(widget);
          widgetInitialized.current = true;
          console.log('ElevenLabs widget initialized with config');
          
          // Add event listeners
          widget.addEventListener('load', () => {
            console.log('Widget loaded successfully');
            toast({
              title: "Voice Chat Ready",
              description: "The voice chat widget has been initialized",
            });
            setIsLoading(false);
          });

          widget.addEventListener('error', (error) => {
            console.error('Widget error:', error);
            toast({
              title: "Error",
              description: "Failed to initialize voice chat. Please try again.",
              variant: "destructive",
            });
            setIsLoading(false);
          });
        }
      } catch (error) {
        console.error('Initialization error:', error);
        toast({
          title: "Error",
          description: "Failed to initialize voice chat. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    initializeWidget();

    return () => {
      if (containerRef.current) {
        const widget = containerRef.current.querySelector('elevenlabs-convai');
        if (widget) {
          widget.remove();
        }
      }
      widgetInitialized.current = false;
    };
  }, [toast]);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Voice Chat</h2>
      <div 
        ref={containerRef} 
        className={`min-h-[400px] flex items-center justify-center ${isLoading ? 'animate-pulse' : ''}`}
      >
        {isLoading && <p>Initializing voice chat...</p>}
      </div>
    </Card>
  );
}
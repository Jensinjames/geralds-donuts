import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { VOICE_CHAT_CONFIG } from "@/config/voiceChat";

export const useVoiceChat = () => {
  const { toast } = useToast();
  const widgetInitialized = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeWidget = async (containerRef: HTMLDivElement | null) => {
    if (!containerRef || widgetInitialized.current) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Clean up existing widget
      const existingWidget = containerRef.querySelector('elevenlabs-convai');
      if (existingWidget) {
        existingWidget.remove();
      }

      console.log('Fetching signed URL...');
      const { data, error: urlError } = await supabase.functions.invoke('get-elevenlabs-url');
      
      if (urlError || !data?.signedUrl) {
        console.error('Error fetching signed URL:', urlError || 'No URL returned');
        throw new Error(urlError?.message || 'Failed to get signed URL');
      }

      console.log('Got signed URL, initializing widget...');
      
      const widget = document.createElement('elevenlabs-convai');
      widget.setAttribute('url', data.signedUrl);
      widget.setAttribute('config', JSON.stringify(VOICE_CHAT_CONFIG));
      
      containerRef.appendChild(widget);
      widgetInitialized.current = true;
      console.log('Widget added to DOM');
      
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
        setError('Failed to initialize voice chat. Please try again.');
        setIsLoading(false);
      });

    } catch (error) {
      console.error('Initialization error:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize voice chat');
      setIsLoading(false);
    }
  };

  const cleanup = (containerRef: HTMLDivElement | null) => {
    if (containerRef) {
      const widget = containerRef.querySelector('elevenlabs-convai');
      if (widget) {
        widget.remove();
      }
    }
    widgetInitialized.current = false;
  };

  return {
    isLoading,
    error,
    initializeWidget,
    cleanup
  };
};
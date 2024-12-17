import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export function VoiceChat() {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetInitialized = useRef(false);

  useEffect(() => {
    const initializeWidget = () => {
      if (widgetInitialized.current) return;
      
      // Clean up any existing widget instances
      const existingWidget = document.querySelector('elevenlabs-convai');
      if (existingWidget) {
        existingWidget.remove();
      }

      // Create and append the new widget
      const widget = document.createElement('elevenlabs-convai');
      widget.setAttribute('agent-id', 'KhGDINYSBcAFlPxBCRom');
      
      if (containerRef.current) {
        containerRef.current.appendChild(widget);
        widgetInitialized.current = true;
        console.log('ElevenLabs widget initialized');
        
        // Add event listener for widget load
        widget.addEventListener('load', () => {
          console.log('ElevenLabs widget loaded successfully');
          toast({
            title: "Voice Chat Ready",
            description: "The voice chat widget has been initialized",
          });
        });
      }
    };

    // Check if the ElevenLabs script is loaded
    if (document.querySelector('script[src*="convai-widget"]')) {
      initializeWidget();
    } else {
      // If script is not loaded, wait for it
      const scriptLoadCheck = setInterval(() => {
        if (document.querySelector('script[src*="convai-widget"]')) {
          clearInterval(scriptLoadCheck);
          initializeWidget();
        }
      }, 100);

      // Clear interval after 10 seconds if script hasn't loaded
      setTimeout(() => {
        clearInterval(scriptLoadCheck);
        if (!widgetInitialized.current) {
          console.error('Failed to load ElevenLabs widget script');
          toast({
            title: "Error",
            description: "Failed to initialize voice chat. Please refresh the page.",
            variant: "destructive",
          });
        }
      }, 10000);
    }

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
      <div ref={containerRef} className="min-h-[400px]"></div>
    </Card>
  );
}
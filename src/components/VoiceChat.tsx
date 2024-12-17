import { useEffect } from "react";
import { Card } from "@/components/ui/card";

export function VoiceChat() {
  useEffect(() => {
    // Clean up any existing widget instances
    const existingWidget = document.querySelector('elevenlabs-convai');
    if (existingWidget) {
      existingWidget.remove();
    }

    // Create and append the new widget
    const widget = document.createElement('elevenlabs-convai');
    widget.setAttribute('agent-id', 'KhGDINYSBcAFlPxBCRom');
    
    // Find the container and append the widget
    const container = document.getElementById('voice-chat-container');
    if (container) {
      container.appendChild(widget);
    }

    // Cleanup on unmount
    return () => {
      const widget = document.querySelector('elevenlabs-convai');
      if (widget) {
        widget.remove();
      }
    };
  }, []);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Voice Chat</h2>
      <div id="voice-chat-container" className="min-h-[400px]"></div>
    </Card>
  );
}
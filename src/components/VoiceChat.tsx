import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useVoiceChat } from "@/hooks/useVoiceChat";

export function VoiceChat() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoading, error, initializeWidget, cleanup } = useVoiceChat();

  useEffect(() => {
    initializeWidget(containerRef.current);
    return () => cleanup(containerRef.current);
  }, []);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Voice Chat</h2>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div 
        ref={containerRef} 
        className={`min-h-[400px] flex items-center justify-center ${isLoading ? 'animate-pulse' : ''}`}
        style={{ width: '100%', height: '500px' }}
      >
        {isLoading && <p>Initializing voice chat...</p>}
      </div>
    </Card>
  );
}
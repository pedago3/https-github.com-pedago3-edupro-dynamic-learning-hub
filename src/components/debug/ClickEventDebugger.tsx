
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Trash2 } from 'lucide-react';

interface ClickEventLog {
  id: string;
  timestamp: Date;
  eventType: string;
  action: string;
  element: string;
  page: string;
  success: boolean;
  message?: string;
}

export const ClickEventDebugger = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [eventLogs, setEventLogs] = useState<ClickEventLog[]>([]);

  useEffect(() => {
    // Listen for click events (this would be integrated with your click manager)
    const handleClickEvent = (event: CustomEvent) => {
      const log: ClickEventLog = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        eventType: event.detail.type,
        action: event.detail.action,
        element: event.detail.element,
        page: event.detail.page,
        success: event.detail.success,
        message: event.detail.message
      };
      
      setEventLogs(prev => [log, ...prev.slice(0, 49)]); // Keep last 50 events
    };

    window.addEventListener('click-event-debug', handleClickEvent as EventListener);
    
    return () => {
      window.removeEventListener('click-event-debug', handleClickEvent as EventListener);
    };
  }, []);

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsVisible(true)}
          className="bg-white shadow-lg"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 overflow-hidden">
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            Click Event Debugger
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEventLogs([])}
                className="h-6 w-6 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0"
              >
                <EyeOff className="h-3 w-3" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 max-h-80 overflow-y-auto">
          {eventLogs.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No click events tracked yet
            </p>
          ) : (
            <div className="space-y-2">
              {eventLogs.map((log) => (
                <div key={log.id} className="text-xs border rounded p-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge variant={log.success ? "default" : "destructive"} className="text-xs">
                      {log.action}
                    </Badge>
                    <span className="text-muted-foreground">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    {log.element} on {log.page}
                  </div>
                  {log.message && (
                    <div className="text-xs">{log.message}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

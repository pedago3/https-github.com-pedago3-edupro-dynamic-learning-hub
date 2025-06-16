
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  ClickEventConfig, 
  ClickEventContext, 
  ClickActionResult,
  ClickActionType 
} from '@/types/clickEvents';

export const useClickEventManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});

  // Track click events for analytics
  const trackClickEvent = useCallback((config: ClickEventConfig, context: ClickEventContext) => {
    console.log('Click Event Tracked:', {
      config,
      context,
      user: user?.id
    });
    
    // Here you could send analytics data to your tracking service
  }, [user]);

  // Execute different types of actions
  const executeAction = useCallback(async (
    action: ClickActionType,
    config: ClickEventConfig
  ): Promise<ClickActionResult> => {
    switch (action) {
      case 'navigate':
        if (config.target) {
          navigate(config.target);
          return { success: true, message: 'Navigation successful' };
        }
        return { success: false, message: 'No navigation target specified' };

      case 'external-link':
        if (config.target) {
          window.open(config.target, '_blank', 'noopener,noreferrer');
          return { success: true, message: 'External link opened' };
        }
        return { success: false, message: 'No external link specified' };

      case 'show-toast':
        toast({
          title: config.payload?.title || 'Notification',
          description: config.payload?.description || 'Action completed',
          variant: config.payload?.variant || 'default'
        });
        return { success: true, message: 'Toast displayed' };

      case 'copy-to-clipboard':
        if (config.payload?.text) {
          try {
            await navigator.clipboard.writeText(config.payload.text);
            toast({
              title: "Copié !",
              description: "Le texte a été copié dans le presse-papier.",
            });
            return { success: true, message: 'Text copied to clipboard' };
          } catch (error) {
            return { success: false, message: 'Failed to copy to clipboard' };
          }
        }
        return { success: false, message: 'No text to copy' };

      case 'download':
        if (config.target) {
          const link = document.createElement('a');
          link.href = config.target;
          link.download = config.payload?.filename || 'download';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return { success: true, message: 'Download started' };
        }
        return { success: false, message: 'No download URL specified' };

      default:
        return { success: false, message: `Unknown action: ${action}` };
    }
  }, [navigate, toast]);

  // Main click handler
  const handleClick = useCallback(async (
    config: ClickEventConfig,
    context?: Partial<ClickEventContext>
  ) => {
    const eventId = config.id;
    
    // Prevent double clicks
    if (isProcessing[eventId]) {
      return;
    }

    setIsProcessing(prev => ({ ...prev, [eventId]: true }));

    try {
      // Show loading feedback if configured
      if (config.feedback?.loading) {
        toast({
          title: config.feedback.loading,
          description: "Traitement en cours...",
        });
      }

      // Track the click event
      const fullContext: ClickEventContext = {
        element: context?.element || config.id,
        page: context?.page || window.location.pathname,
        user: user?.id,
        timestamp: new Date(),
        ...context
      };

      trackClickEvent(config, fullContext);

      // Execute the action
      const result = await executeAction(config.action, config);

      // Show success/error feedback
      if (result.success && config.feedback?.success) {
        toast({
          title: config.feedback.success,
          description: result.message,
        });
      } else if (!result.success && config.feedback?.error) {
        toast({
          title: config.feedback.error,
          description: result.message,
          variant: "destructive",
        });
      }

      return result;
    } catch (error) {
      console.error('Click event error:', error);
      
      if (config.feedback?.error) {
        toast({
          title: config.feedback.error,
          description: "Une erreur inattendue s'est produite.",
          variant: "destructive",
        });
      }

      return { success: false, message: 'Unexpected error occurred' };
    } finally {
      setIsProcessing(prev => ({ ...prev, [eventId]: false }));
    }
  }, [executeAction, isProcessing, toast, trackClickEvent, user]);

  // Helper to check if an event is processing
  const isEventProcessing = useCallback((eventId: string) => {
    return isProcessing[eventId] || false;
  }, [isProcessing]);

  return {
    handleClick,
    isEventProcessing,
    trackClickEvent
  };
};

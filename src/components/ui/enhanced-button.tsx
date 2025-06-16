
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useClickEventManager } from '@/hooks/useClickEventManager';
import { ClickEventConfig } from '@/types/clickEvents';
import { cn } from '@/lib/utils';

interface EnhancedButtonProps extends ButtonProps {
  clickEvent?: ClickEventConfig;
  clickEventId?: string;
  loading?: boolean;
  children: React.ReactNode;
}

export const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ clickEvent, clickEventId, loading, className, children, onClick, ...props }, ref) => {
    const { handleClick, isEventProcessing } = useClickEventManager();

    const eventConfig = clickEvent || (clickEventId ? { 
      id: clickEventId, 
      type: 'button' as const, 
      action: 'show-toast' as const 
    } : undefined);

    const isProcessing = eventConfig ? isEventProcessing(eventConfig.id) : false;
    const isLoading = loading || isProcessing;

    const handleEnhancedClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      // Call original onClick if provided
      if (onClick) {
        onClick(event);
      }

      // Handle enhanced click event if configured
      if (eventConfig) {
        await handleClick(eventConfig, {
          element: `button-${eventConfig.id}`,
          page: window.location.pathname
        });
      }
    };

    return (
      <Button
        ref={ref}
        className={cn(
          'relative transition-all duration-200',
          isLoading && 'cursor-not-allowed opacity-70',
          className
        )}
        disabled={props.disabled || isLoading}
        onClick={handleEnhancedClick}
        aria-label={eventConfig?.accessibility?.ariaLabel}
        aria-describedby={eventConfig?.accessibility?.description}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          </div>
        )}
        <span className={cn(isLoading && 'opacity-0')}>
          {children}
        </span>
      </Button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

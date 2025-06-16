
import React, { useState } from 'react';
import { MoreVertical, X } from 'lucide-react';
import { ResponsiveButton } from './responsive-button';
import { cn } from '@/lib/utils';
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

interface AdaptiveMenuProps {
  items: MenuItem[];
  trigger?: React.ReactNode;
  className?: string;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

export const AdaptiveMenu = ({ 
  items, 
  trigger,
  className,
  placement = 'bottom-end'
}: AdaptiveMenuProps) => {
  const { isMobile } = useBreakpoint();
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (item: MenuItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  const defaultTrigger = (
    <ResponsiveButton
      variant="ghost"
      size="lg"
      onClick={() => setIsOpen(!isOpen)}
      aria-label="Ouvrir le menu"
    >
      <MoreVertical className="h-5 w-5" />
    </ResponsiveButton>
  );

  if (isMobile) {
    // Version drawer pour mobile
    return (
      <>
        <div onClick={() => setIsOpen(!isOpen)}>
          {trigger || defaultTrigger}
        </div>

        {/* Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Drawer */}
        <div className={cn(
          'fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-2xl z-50',
          'transform transition-transform duration-300 ease-out',
          'max-h-[80vh] overflow-y-auto',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}>
          {/* Barre de titre */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Menu</h3>
            <ResponsiveButton
              variant="ghost"
              size="lg"
              onClick={() => setIsOpen(false)}
              className="min-h-[48px] min-w-[48px]"
            >
              <X className="h-5 w-5" />
            </ResponsiveButton>
          </div>

          {/* Items du menu */}
          <div className="p-2">
            {items.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-4 text-left',
                    'rounded-lg transition-colors duration-200',
                    'min-h-[48px]', // Optimisé pour le tactile
                    'hover:bg-gray-100 active:bg-gray-200',
                    item.disabled && 'opacity-50 cursor-not-allowed',
                    item.destructive && 'text-red-600 hover:bg-red-50'
                  )}
                >
                  {IconComponent && (
                    <IconComponent className={cn(
                      'h-5 w-5 flex-shrink-0',
                      item.destructive && 'text-red-500'
                    )} />
                  )}
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  // Version dropdown pour desktop
  return (
    <div className={cn('relative', className)}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || defaultTrigger}
      </div>

      {/* Overlay invisible pour fermer */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu dropdown */}
      <div className={cn(
        'absolute z-50 mt-2 w-56 bg-white rounded-lg shadow-lg border',
        'transform transition-all duration-200 origin-top-right',
        isOpen 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 -translate-y-1 pointer-events-none',
        {
          'right-0': placement.includes('end'),
          'left-0': placement.includes('start'),
          'bottom-full mb-2': placement.includes('top')
        }
      )}>
        <div className="py-1">
          {items.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2 text-left text-sm',
                  'transition-colors duration-200',
                  'hover:bg-gray-100 active:bg-gray-200',
                  item.disabled && 'opacity-50 cursor-not-allowed',
                  item.destructive && 'text-red-600 hover:bg-red-50'
                )}
              >
                {IconComponent && (
                  <IconComponent className={cn(
                    'h-4 w-4 flex-shrink-0',
                    item.destructive && 'text-red-500'
                  )} />
                )}
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

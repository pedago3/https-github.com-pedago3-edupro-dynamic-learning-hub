
// Define types of click events in the application
export type ClickEventType = 
  | 'button'
  | 'link'
  | 'card'
  | 'icon'
  | 'menu-item'
  | 'tab'
  | 'modal-trigger'
  | 'course-enroll'
  | 'lesson-start'
  | 'navigation';

// Define possible actions that can be triggered
export type ClickActionType = 
  | 'navigate'
  | 'open-modal'
  | 'close-modal'
  | 'submit-form'
  | 'toggle-expand'
  | 'enroll-course'
  | 'start-lesson'
  | 'show-toast'
  | 'external-link'
  | 'download'
  | 'copy-to-clipboard';

// Define the structure of a click event configuration
export interface ClickEventConfig {
  id: string;
  type: ClickEventType;
  action: ClickActionType;
  target?: string; // URL, modal ID, etc.
  payload?: Record<string, any>; // Additional data for the action
  feedback?: {
    loading?: string;
    success?: string;
    error?: string;
  };
  accessibility?: {
    ariaLabel?: string;
    description?: string;
  };
}

// Define click event context for better tracking
export interface ClickEventContext {
  element: string;
  page: string;
  user?: string;
  timestamp: Date;
}

// Define the result of a click action
export interface ClickActionResult {
  success: boolean;
  message?: string;
  data?: any;
  redirect?: string;
}

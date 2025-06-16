
import { ClickEventConfig } from '@/types/clickEvents';

// Predefined click event configurations
export const CLICK_EVENTS: Record<string, ClickEventConfig> = {
  // Navigation events
  NAVIGATE_TO_PROFILE: {
    id: 'navigate-to-profile',
    type: 'menu-item',
    action: 'navigate',
    target: '/profile',
    accessibility: {
      ariaLabel: 'Aller au profil utilisateur',
      description: 'Navigue vers la page de profil'
    }
  },

  NAVIGATE_TO_COURSES: {
    id: 'navigate-to-courses',
    type: 'menu-item',
    action: 'navigate',
    target: '/dashboard',
    accessibility: {
      ariaLabel: 'Aller aux cours',
      description: 'Navigue vers la page des cours'
    }
  },

  // External links
  OPEN_DOCUMENTATION: {
    id: 'open-documentation',
    type: 'link',
    action: 'external-link',
    target: 'https://docs.lovable.dev',
    feedback: {
      success: 'Documentation ouverte',
    },
    accessibility: {
      ariaLabel: 'Ouvrir la documentation',
      description: 'Ouvre la documentation dans un nouvel onglet'
    }
  },

  // Course interactions
  ENROLL_COURSE: {
    id: 'enroll-course',
    type: 'button',
    action: 'show-toast',
    feedback: {
      loading: 'Inscription en cours...',
      success: 'Inscription réussie !',
      error: 'Erreur lors de l\'inscription'
    },
    accessibility: {
      ariaLabel: 'S\'inscrire au cours',
      description: 'Lance le processus d\'inscription au cours'
    }
  },

  START_LESSON: {
    id: 'start-lesson',
    type: 'button',
    action: 'navigate',
    feedback: {
      loading: 'Chargement de la leçon...',
    },
    accessibility: {
      ariaLabel: 'Commencer la leçon',
      description: 'Démarre la leçon sélectionnée'
    }
  },

  // Utility actions
  COPY_COURSE_LINK: {
    id: 'copy-course-link',
    type: 'button',
    action: 'copy-to-clipboard',
    feedback: {
      success: 'Lien copié !',
      error: 'Impossible de copier le lien'
    },
    accessibility: {
      ariaLabel: 'Copier le lien du cours',
      description: 'Copie le lien du cours dans le presse-papier'
    }
  },

  // Download actions
  DOWNLOAD_RESOURCE: {
    id: 'download-resource',
    type: 'button',
    action: 'download',
    feedback: {
      loading: 'Préparation du téléchargement...',
      success: 'Téléchargement démarré',
      error: 'Erreur lors du téléchargement'
    },
    accessibility: {
      ariaLabel: 'Télécharger la ressource',
      description: 'Télécharge la ressource sélectionnée'
    }
  }
};

// Helper function to create dynamic click events
export const createClickEvent = (
  id: string,
  baseConfig: Partial<ClickEventConfig>
): ClickEventConfig => {
  return {
    id,
    type: 'button',
    action: 'show-toast',
    ...baseConfig
  };
};

// Helper function to get click event by ID
export const getClickEvent = (id: string): ClickEventConfig | undefined => {
  return CLICK_EVENTS[id];
};


import React from 'react';
import { ResponsiveNavigation } from '@/components/ui/responsive-navigation';
import { ResponsiveCardGrid, ResponsiveCard } from '@/components/ui/responsive-card-grid';
import { ResponsiveButton } from '@/components/ui/responsive-button';
import { AdaptiveMenu } from '@/components/ui/adaptive-menu';
import { Home, Settings, User, Bell, Search, Edit, Trash2, Share } from 'lucide-react';

export const ResponsiveComponentsExample = () => {
  const navigationItems = [
    { id: 'home', label: 'Accueil', href: '#', icon: Home, isActive: true },
    { id: 'profile', label: 'Profil', href: '#', icon: User },
    { id: 'notifications', label: 'Notifications', href: '#', icon: Bell },
    { id: 'search', label: 'Recherche', href: '#', icon: Search },
    { id: 'settings', label: 'Paramètres', href: '#', icon: Settings },
  ];

  const menuItems = [
    { id: 'edit', label: 'Modifier', icon: Edit, onClick: () => console.log('Modifier') },
    { id: 'share', label: 'Partager', icon: Share, onClick: () => console.log('Partager') },
    { id: 'delete', label: 'Supprimer', icon: Trash2, onClick: () => console.log('Supprimer'), destructive: true },
  ];

  const handleNavigation = (item: any) => {
    console.log('Navigation vers:', item.label);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation responsive */}
      <ResponsiveNavigation
        items={navigationItems}
        onItemClick={handleNavigation}
        logo={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg"></div>
            <span className="font-bold text-xl text-gray-900">Mon App</span>
          </div>
        }
      />

      {/* Contenu principal */}
      <div className="adaptive-container py-8">
        {/* Boutons responsifs */}
        <div className="mb-8 flex flex-wrap gap-4">
          <ResponsiveButton variant="default">
            Bouton principal
          </ResponsiveButton>
          
          <ResponsiveButton 
            variant="outline"
            hideOnBreakpoint="mobile"
          >
            Masqué sur mobile
          </ResponsiveButton>
          
          <ResponsiveButton 
            variant="secondary"
            showOnBreakpoint="mobile"
          >
            Visible sur mobile uniquement
          </ResponsiveButton>

          <AdaptiveMenu items={menuItems} />
        </div>

        {/* Grille de cartes responsive */}
        <ResponsiveCardGrid
          columns={{ mobile: 1, tablet: 2, desktop: 3, xl: 4 }}
          gap={{ mobile: '1rem', tablet: '1.5rem', desktop: '2rem' }}
        >
          <ResponsiveCard
            title="Carte Standard"
            priority={1}
            stackOrder={{ mobile: 1, tablet: 1, desktop: 1 }}
          >
            <p className="text-gray-600">
              Cette carte s'adapte à tous les écrans avec des transitions fluides.
            </p>
            <ResponsiveButton className="mt-4" variant="outline" size="sm">
              Action
            </ResponsiveButton>
          </ResponsiveCard>

          <ResponsiveCard
            title="Carte Compacte"
            variant="compact"
            priority={2}
            stackOrder={{ mobile: 3, tablet: 2, desktop: 2 }}
          >
            <p className="text-gray-600 text-sm">
              Version compacte avec moins d'espacement.
            </p>
          </ResponsiveCard>

          <ResponsiveCard
            title="Carte Mise en Avant"
            variant="featured"
            priority={3}
            stackOrder={{ mobile: 2, tablet: 3, desktop: 3 }}
          >
            <p className="text-gray-700">
              Cette carte a un style spécial et est réorganisée sur mobile.
            </p>
            <div className="flex gap-2 mt-4">
              <ResponsiveButton size="sm">Voir plus</ResponsiveButton>
              <AdaptiveMenu items={menuItems} />
            </div>
          </ResponsiveCard>

          <ResponsiveCard
            title="Masquée sur Mobile"
            hideOnBreakpoint="mobile"
            priority={4}
          >
            <p className="text-gray-600">
              Cette carte n'apparaît que sur tablette et desktop.
            </p>
          </ResponsiveCard>

          <ResponsiveCard
            title="Données Importantes"
            priority={0}
            stackOrder={{ mobile: 0, tablet: 4, desktop: 4 }}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Utilisateurs actifs</span>
                <span className="font-bold text-blue-600">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taux de conversion</span>
                <span className="font-bold text-green-600">12.5%</span>
              </div>
              <ResponsiveButton 
                className="w-full mt-4"
                responsiveSize={{ mobile: 'lg', desktop: 'default' }}
              >
                Voir le rapport
              </ResponsiveButton>
            </div>
          </ResponsiveCard>
        </ResponsiveCardGrid>

        {/* Section d'exemple avec différentes tailles de boutons */}
        <div className="mt-12 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Boutons Adaptatifs
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Tailles Standard</h3>
              <ResponsiveButton size="sm">Petit</ResponsiveButton>
              <ResponsiveButton>Moyen</ResponsiveButton>
              <ResponsiveButton size="lg">Grand</ResponsiveButton>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Optimisés Tactile</h3>
              <ResponsiveButton 
                touchOptimized={true}
                responsiveSize={{ mobile: 'lg', desktop: 'default' }}
              >
                Auto-adaptatif
              </ResponsiveButton>
              <ResponsiveButton 
                className="min-h-[48px] min-w-[120px]"
                variant="outline"
              >
                Zone tactile étendue
              </ResponsiveButton>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Visibilité Conditionnelle</h3>
              <ResponsiveButton hideOnBreakpoint="mobile" variant="secondary">
                Desktop seulement
              </ResponsiveButton>
              <ResponsiveButton showOnBreakpoint="mobile" variant="destructive">
                Mobile seulement
              </ResponsiveButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

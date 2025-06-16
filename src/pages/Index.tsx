import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, Users, Award, MessageCircle, User } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    console.log('Index: Auth state changed', { user: user?.id, profile: profile?.role, loading });
    
    // Rediriger les utilisateurs authentifiés vers leur dashboard approprié
    if (!loading && user && profile) {
      if (profile.role === 'teacher') {
        console.log('Redirecting teacher to dashboard');
        navigate('/teacher-dashboard');
      } else {
        console.log('Redirecting student to dashboard');
        navigate('/dashboard');
      }
    }
  }, [user, profile, loading, navigate]);

  // Afficher un loader pendant le chargement de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Image */}
      <div className="relative h-96 bg-cover bg-center" style={{
        backgroundImage: 'url(/lovable-uploads/7c82d74c-8762-4065-8a44-5701df19a123.png)'
      }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative container mx-auto px-4 py-8 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4">EduPro</h1>
            <p className="text-2xl mb-8">
              Votre plateforme éducative moderne pour un apprentissage interactif
            </p>
            
            <div className="flex gap-4 justify-center">
              {!user ? (
                <>
                  <Button 
                    onClick={() => navigate('/auth')} 
                    size="lg"
                    className="text-lg px-8 bg-primary hover:bg-primary/90"
                  >
                    Se connecter
                  </Button>
                  <Button 
                    onClick={() => navigate('/auth')} 
                    variant="outline" 
                    size="lg"
                    className="text-lg px-8 bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    S'inscrire
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => navigate('/profile')} 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <User className="mr-2 h-5 w-5" />
                  Mon Profil
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Cours Interactifs</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Accédez à des cours structurés avec du contenu multimédia et des exercices pratiques
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Classes Virtuelles</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Participez à des classes en ligne avec vos enseignants et camarades
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Système de Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gagnez des badges en complétant vos missions et en progressant dans vos cours
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Communiquez directement avec vos enseignants via notre système de messagerie intégré
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials or additional content */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Pourquoi choisir EduPro ?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Interface Intuitive</h3>
              <p className="text-gray-600">
                Une interface moderne et facile à utiliser, conçue pour optimiser votre expérience d'apprentissage
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Suivi Personnalisé</h3>
              <p className="text-gray-600">
                Suivez votre progression en temps réel et recevez des recommandations personnalisées
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Support Complet</h3>
              <p className="text-gray-600">
                Bénéficiez d'un support pédagogique complet avec des outils d'évaluation et de feedback
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

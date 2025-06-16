
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Loader2, User as UserIcon, LogOut } from 'lucide-react';

export const UserProfile = () => {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    role: profile?.role || 'student',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    try {
      const { error } = await updateProfile({
        full_name: formData.full_name,
        role: formData.role as 'teacher' | 'student' | 'admin',
      });

      if (error) {
        toast({
          title: 'Échec de la mise à jour',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Profil mis à jour',
          description: 'Votre profil a été mis à jour avec succès.',
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur inattendue s\'est produite.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Déconnecté',
        description: 'Vous avez été déconnecté avec succès.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Échec de la déconnexion.',
        variant: 'destructive',
      });
    }
  };

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <UserIcon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle>Profil</CardTitle>
        <CardDescription>Gérez les informations de votre compte</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Étudiant</SelectItem>
                  <SelectItem value="teacher">Enseignant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Email</Label>
              <p className="text-sm">{user.email}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Nom complet</Label>
              <p className="text-sm">{profile.full_name || 'Non défini'}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Rôle</Label>
              <p className="text-sm capitalize">{profile.role === 'student' ? 'Étudiant' : 'Enseignant'}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Membre depuis</Label>
              <p className="text-sm">{new Date(profile.created_at).toLocaleDateString('fr-FR')}</p>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="flex-1"
              >
                Modifier le profil
              </Button>
              <Button 
                onClick={handleSignOut}
                variant="destructive"
                className="flex-1"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

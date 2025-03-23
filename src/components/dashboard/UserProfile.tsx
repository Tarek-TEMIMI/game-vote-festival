
import { useState } from 'react';
import { User, Mail, Camera } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const UserProfile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Update user metadata in Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: { name }
      });
      
      if (authError) throw authError;
      
      // Update user data in users table
      const { error: profileError } = await supabase
        .from('users')
        .update({ name })
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Informations du profil</h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {user?.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt={name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg">
              <Camera size={18} />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Taille recommandée : 300x300px
          </p>
        </div>
        
        <div className="flex-grow">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <Input 
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  className="pl-10"
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
            </div>
            
            <div>
              <Label htmlFor="name">Nom</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <Input 
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  placeholder="Votre nom"
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? 'Mise à jour...' : 'Mettre à jour le profil'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Card>
  );
};

export default UserProfile;

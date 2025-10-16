import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, UserCog } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

type AppRole = Database['public']['Enums']['app_role'];

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  role?: AppRole;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Merge users with their roles
      const usersWithRoles = usersData?.map((user) => ({
        ...user,
        role: rolesData?.find((r) => r.user_id === user.id)?.role || 'player',
      }));

      setUsers(usersWithRoles || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les utilisateurs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: AppRole) => {
    setUpdating(userId);
    try {
      // Check if user already has a role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from('user_roles')
          .insert([{ user_id: userId, role: newRole }]);

        if (error) throw error;
      }

      toast({
        title: 'Succès',
        description: 'Le rôle a été mis à jour',
      });

      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le rôle',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case 'super_admin':
        return 'destructive';
      case 'editor':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getRoleLabel = (role: AppRole) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'editor':
        return 'Éditeur';
      default:
        return 'Joueur';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <UserCog className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Gestion des utilisateurs</h3>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead>Rôle actuel</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role || 'player')}>
                    {getRoleLabel(user.role || 'player')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Select
                      value={user.role || 'player'}
                      onValueChange={(value) => updateUserRole(user.id, value as AppRole)}
                      disabled={updating === user.id}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="player">Joueur</SelectItem>
                        <SelectItem value="editor">Éditeur</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {updating === user.id && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        Total: {users.length} utilisateur{users.length > 1 ? 's' : ''}
      </div>
    </Card>
  );
};

export default UserManagement;

/**
 * Hook personnalisé pour les requêtes de données filtrées par organisation
 * Fournit des fonctions utilitaires pour les opérations CRUD avec isolation multi-tenant
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOrganization } from '@/context/OrganizationContext';
import { toast } from '@/components/ui/use-toast';

// Interface pour les jeux avec organization_id (optionnel pour la migration progressive)
interface GameWithOrganization {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  publisher: string;
  voting_enabled: boolean;
  organization_id?: string; // Optionnel pendant la migration
  user_id: string;
  created_at: string;
}

// Interface pour les concours avec organization_id (optionnel pour la migration progressive)
interface ContestWithOrganization {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  event_id: string | null;
  voting_enabled: boolean;
  organization_id?: string; // Optionnel pendant la migration
  user_id: string;
  created_at: string;
}

// Interface pour les événements avec organization_id (optionnel pour la migration progressive)
interface EventWithOrganization {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  address: string;
  logo: string;
  images: string[];
  organization_id?: string; // Optionnel pendant la migration
  user_id: string;
  created_at: string;
}

// Hook pour récupérer les jeux de l'organisation courante (ou tous les jeux publics)
export const useOrganizationGames = () => {
  const { currentOrganization } = useOrganization();
  
  return useQuery({
    queryKey: ['games', currentOrganization?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as any;
    },
    enabled: true,
  });
};

// Hook pour récupérer les concours de l'organisation courante (ou tous les concours publics)
export const useOrganizationContests = () => {
  const { currentOrganization } = useOrganization();
  
  return useQuery({
    queryKey: ['contests', currentOrganization?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as any;
    },
    enabled: true,
  });
};

// Hook pour récupérer les événements de l'organisation courante (ou tous les événements publics)
export const useOrganizationEvents = () => {
  const { currentOrganization } = useOrganization();
  
  return useQuery({
    queryKey: ['events', currentOrganization?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as any;
    },
    enabled: true,
  });
};

// Hook pour créer un jeu dans l'organisation courante
export const useCreateGame = () => {
  const { currentOrganization } = useOrganization();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gameData: Omit<GameWithOrganization, 'id' | 'organization_id' | 'created_at'>) => {
      if (!currentOrganization) {
        throw new Error('Aucune organisation sélectionnée');
      }

      const { data, error } = await supabase
        .from('games')
        .insert({
          ...gameData,
          organization_id: currentOrganization.id,
        } as any)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création du jeu:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalider le cache des jeux pour recharger la liste
      queryClient.invalidateQueries({ queryKey: ['games', currentOrganization?.id] });
      toast({
        title: "Jeu créé",
        description: "Le jeu a été ajouté avec succès à votre organisation.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le jeu.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour créer un concours dans l'organisation courante
export const useCreateContest = () => {
  const { currentOrganization } = useOrganization();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contestData: Omit<ContestWithOrganization, 'id' | 'organization_id' | 'created_at'>) => {
      if (!currentOrganization) {
        throw new Error('Aucune organisation sélectionnée');
      }

      const { data, error } = await supabase
        .from('contests')
        .insert({
          ...contestData,
          organization_id: currentOrganization.id,
        } as any)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création du concours:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalider le cache des concours pour recharger la liste
      queryClient.invalidateQueries({ queryKey: ['contests', currentOrganization?.id] });
      toast({
        title: "Concours créé",
        description: "Le concours a été ajouté avec succès à votre organisation.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le concours.",
        variant: "destructive",
      });
    },
  });
};

// Hook pour créer un événement dans l'organisation courante
export const useCreateEvent = () => {
  const { currentOrganization } = useOrganization();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData: Omit<EventWithOrganization, 'id' | 'organization_id' | 'created_at'>) => {
      if (!currentOrganization) {
        throw new Error('Aucune organisation sélectionnée');
      }

      const { data, error } = await supabase
        .from('events')
        .insert({
          ...eventData,
          organization_id: currentOrganization.id,
        } as any)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création de l\'événement:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalider le cache des événements pour recharger la liste
      queryClient.invalidateQueries({ queryKey: ['events', currentOrganization?.id] });
      toast({
        title: "Événement créé",
        description: "L'événement a été ajouté avec succès à votre organisation.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer l'événement.",
        variant: "destructive",
      });
    },
  });
};

// Types exportés
export type { GameWithOrganization, ContestWithOrganization, EventWithOrganization };
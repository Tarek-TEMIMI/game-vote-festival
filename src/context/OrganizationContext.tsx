/**
 * Contexte d'organisation pour la gestion multi-tenant
 * Gère l'organisation actuelle de l'utilisateur et les opérations de changement d'organisation
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

// Types pour les organisations et les membres
interface Organization {
  id: string;
  name: string;
  slug: string;
  owner_user_id: string;
  stripe_customer_id?: string;
  plan: string;
  created_at: string;
}

interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'editor' | 'member';
  created_at: string;
}

interface OrganizationWithRole extends Organization {
  user_role: 'owner' | 'admin' | 'editor' | 'member';
}

interface OrganizationContextType {
  currentOrganization: OrganizationWithRole | null;
  userOrganizations: OrganizationWithRole[];
  loading: boolean;
  switchOrganization: (organizationId: string) => Promise<void>;
  refreshOrganizations: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

interface OrganizationProviderProps {
  children: ReactNode;
}

export const OrganizationProvider = ({ children }: OrganizationProviderProps) => {
  const { user, loading: authLoading } = useAuth();
  const [currentOrganization, setCurrentOrganization] = useState<OrganizationWithRole | null>(null);
  const [userOrganizations, setUserOrganizations] = useState<OrganizationWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer les organisations de l'utilisateur
  const fetchUserOrganizations = async () => {
    if (!user) return;

    try {
      // Créer une organisation par défaut pour l'utilisateur pendant la migration
      // Cette logique sera remplacée une fois que les tables d'organisation seront créées
      const defaultOrganization: OrganizationWithRole = {
        id: `default-${user.id}`,
        name: `Organisation de ${user.email}`,
        slug: `default-${user.id}`,
        owner_user_id: user.id,
        plan: 'free',
        created_at: new Date().toISOString(),
        user_role: 'owner'
      };

      setUserOrganizations([defaultOrganization]);

      // Si aucune organisation actuelle n'est définie, sélectionner la première
      if (!currentOrganization) {
        setCurrentOrganization(defaultOrganization);
      }
    } catch (error: any) {
      console.error('Erreur lors de la récupération des organisations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos organisations.",
        variant: "destructive",
      });
    }
  };

  // Effet pour charger les organisations au montage et changement d'utilisateur
  useEffect(() => {
    if (!authLoading && user) {
      fetchUserOrganizations().finally(() => setLoading(false));
    } else if (!authLoading && !user) {
      // Réinitialiser l'état si l'utilisateur n'est pas connecté
      setCurrentOrganization(null);
      setUserOrganizations([]);
      setLoading(false);
    }
  }, [user, authLoading]);

  // Fonction pour changer d'organisation
  const switchOrganization = async (organizationId: string) => {
    const organization = userOrganizations.find(org => org.id === organizationId);
    if (organization) {
      setCurrentOrganization(organization);
      toast({
        title: "Organisation changée",
        description: `Vous travaillez maintenant sur "${organization.name}".`,
      });
    }
  };

  // Fonction pour rafraîchir les organisations
  const refreshOrganizations = async () => {
    setLoading(true);
    await fetchUserOrganizations();
    setLoading(false);
  };

  const value = {
    currentOrganization,
    userOrganizations,
    loading,
    switchOrganization,
    refreshOrganizations,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'organisation
export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};

// Types exportés pour utilisation dans d'autres composants
export type { Organization, OrganizationMember, OrganizationWithRole };
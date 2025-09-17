/**
 * Composant de sélection d'organisation
 * Permet à l'utilisateur de basculer entre ses différentes organisations
 */

import { useState } from 'react';
import { Check, ChevronsUpDown, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useOrganization } from '@/context/OrganizationContext';

export const OrganizationSwitcher = () => {
  const { currentOrganization, userOrganizations, switchOrganization, loading } = useOrganization();
  const [open, setOpen] = useState(false);

  // Ne pas afficher le composant si l'utilisateur n'a pas d'organisations
  if (loading || !userOrganizations.length) {
    return null;
  }

  // Fonction pour obtenir le libellé du plan
  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'free': return 'Gratuit';
      case 'pro': return 'Pro';
      case 'enterprise': return 'Enterprise';
      default: return plan;
    }
  };

  // Fonction pour obtenir la couleur du badge selon le plan
  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'pro': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          <div className="flex items-center">
            <Building2 className="mr-2 h-4 w-4" />
            <span className="truncate">
              {currentOrganization ? currentOrganization.name : "Sélectionner une organisation"}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher une organisation..." />
          <CommandEmpty>Aucune organisation trouvée.</CommandEmpty>
          <CommandGroup>
            {userOrganizations.map((organization) => (
              <CommandItem
                key={organization.id}
                value={organization.name}
                onSelect={() => {
                  switchOrganization(organization.id);
                  setOpen(false);
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentOrganization?.id === organization.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{organization.name}</span>
                      <span className="text-xs text-gray-500">
                        {organization.user_role === 'owner' ? 'Propriétaire' : 
                         organization.user_role === 'admin' ? 'Administrateur' :
                         organization.user_role === 'editor' ? 'Éditeur' : 'Membre'}
                      </span>
                    </div>
                  </div>
                  <Badge 
                    className={cn("text-xs", getPlanBadgeColor(organization.plan))}
                  >
                    {getPlanLabel(organization.plan)}
                  </Badge>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default OrganizationSwitcher;
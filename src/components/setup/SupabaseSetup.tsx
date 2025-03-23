
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getSupabaseInstructions, isSupabaseConfigured } from '@/lib/env';

const SupabaseSetup: React.FC = () => {
  const instructions = getSupabaseInstructions();
  const isConfigured = isSupabaseConfigured();

  if (isConfigured) {
    return null;
  }

  return (
    <Card className="p-6 border-yellow-200 bg-yellow-50">
      <div className="flex items-start">
        <AlertTriangle className="w-6 h-6 text-yellow-600 mr-4 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-medium text-yellow-800">{instructions.title}</h3>
          <p className="mt-2 mb-4 text-yellow-700">
            Pour utiliser toutes les fonctionnalités de l'application, veuillez configurer Supabase:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-yellow-700">
            {instructions.steps.map((step, index) => (
              <li key={index} className={step.startsWith('VITE_') ? 'font-mono text-sm bg-yellow-100 px-2 py-1 rounded' : ''}>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Card>
  );
};

export default SupabaseSetup;


import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

// Define a type for the different Airtable configuration types
export type AirtableConfigType = 'mentors' | 'founders' | 'companies' | 'founderOnboarding';

// Define the shape of configuration data
export interface AirtableConfig {
  token: string;
  baseId: string;
  tableName?: string;
  tableId?: string;
}

export const useAirtableConfig = (configType: AirtableConfigType) => {
  const [config, setConfig] = useState<AirtableConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching Airtable config for ${configType}...`);
      const { data, error: fetchError } = await supabase.functions.invoke('get-airtable-config', {
        body: { type: configType }
      });

      if (fetchError) {
        console.error('Error fetching Airtable config:', fetchError);
        setError(`Failed to fetch Airtable configuration: ${fetchError.message}`);
        toast.error('Failed to fetch Airtable configuration');
        return null;
      }

      if (!data) {
        const errorMsg = 'No configuration data received from Supabase';
        console.error(errorMsg);
        setError(errorMsg);
        toast.error('No Airtable configuration found');
        return null;
      }

      console.log(`Successfully fetched ${configType} config:`, {
        hasToken: !!data.token,
        baseId: data.baseId,
        tableName: data.tableName || data.tableId
      });
      
      setConfig(data);
      return data;
    } catch (err: any) {
      const errorMsg = `Error fetching Airtable config: ${err.message}`;
      console.error(errorMsg);
      setError(errorMsg);
      toast.error('Failed to fetch Airtable configuration');
      return null;
    } finally {
      setLoading(false);
    }
  }, [configType]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return { config, loading, error, refetch: fetchConfig };
};

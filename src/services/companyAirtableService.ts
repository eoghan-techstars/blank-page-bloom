import { supabase } from "@/integrations/supabase/client";
import { Company } from '../types/company';

let companyConfig: {
  token: string;
  baseId: string;
  tableId: string;
} | null = null;

// Get configuration from Supabase Edge Function
const getAirtableConfig = async () => {
  if (!companyConfig) {
    const { data, error } = await supabase.functions.invoke('get-airtable-config', {
      body: { type: 'companies' }
    });

    if (error || !data) {
      console.error('Error fetching Company Airtable config:', error);
      throw new Error('Failed to fetch Company Airtable configuration');
    }

    companyConfig = data;
  }
  return companyConfig;
};

class AirtableError extends Error {
  constructor(message: string, public status?: number, public details?: any) {
    super(message);
    this.name = 'AirtableError';
  }
}

function createSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export { createSlug };

export const fetchCompanies = async (): Promise<Company[]> => {
  const config = await getAirtableConfig();
  
  if (!config.token || !config.baseId || !config.tableId) {
    throw new AirtableError('Airtable API credentials not configured');
  }

  try {
    const url = `https://api.airtable.com/v0/${config.baseId}/${config.tableId}?sort[0][field]=company&sort[0][direction]=asc`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${config.token}`
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }
      
      throw new AirtableError(
        `Failed to fetch companies: ${response.status} ${response.statusText}`,
        response.status,
        errorDetails
      );
    }

    const data = await response.json();
    
    return data.records.map((record: any) => ({
      id: record.id,
      company: record.fields.company || '',
      lookbookCompanyName: record.fields.lookbookCompanyName || '',
      URL: record.fields.URL || '',
      companyLinkedIn: record.fields.companyLinkedIn || '',
      logo: record.fields.logo?.[0]?.url || '',
      oneLiner: record.fields.oneLiner || '',
      founders: record.fields.founders || '',
      introductionsNeeded: record.fields.introductionsNeeded || '',
      specificSupport: record.fields.specificSupport || '',
      notionInvestmentMemo: record.fields.notionInvestmentMemo || ''
    }));
  } catch (error) {
    if (error instanceof AirtableError) {
      throw error;
    }
    throw new AirtableError('Failed to fetch companies: Network error or invalid response');
  }
};

export const fetchCompanyBySlug = async (slug: string): Promise<Company | null> => {
  const config = await getAirtableConfig();
  
  if (!config.token || !config.baseId || !config.tableId) {
    throw new AirtableError('Airtable API credentials not configured');
  }

  try {
    const companies = await fetchCompanies();
    const company = companies.find(c => createSlug(c.lookbookCompanyName) === slug);
    
    if (!company) {
      return null;
    }

    return company;
  } catch (error) {
    if (error instanceof AirtableError) {
      throw error;
    }
    throw new AirtableError('Failed to fetch company by slug');
  }
};

export const updateCompanyField = async (companyId: string, field: string, value: string): Promise<void> => {
  const config = await getAirtableConfig();
  
  if (!config.token || !config.baseId || !config.tableId) {
    throw new AirtableError('Airtable API credentials not configured');
  }

  try {
    const url = `https://api.airtable.com/v0/${config.baseId}/${config.tableId}/${companyId}`;
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          [field]: value
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }
      
      throw new AirtableError(
        `Failed to update company field: ${response.status} ${response.statusText}`,
        response.status,
        errorDetails
      );
    }
  } catch (error) {
    if (error instanceof AirtableError) {
      throw error;
    }
    throw new AirtableError('Failed to update company field: Network error or invalid response');
  }
};

import { Company } from '../types/company';

// Get configuration from environment variables
const getAirtableConfig = () => {
  return {
    token: import.meta.env.VITE_COMPANY_AIRTABLE_API_TOKEN || '',
    baseId: import.meta.env.VITE_COMPANY_AIRTABLE_BASE_ID || '',
    tableId: import.meta.env.VITE_COMPANY_AIRTABLE_TABLE_ID || ''
  };
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
  const { token, baseId, tableId } = getAirtableConfig();
  
  if (!token || !baseId || !tableId) {
    throw new AirtableError('Airtable API credentials not configured in environment variables');
  }

  try {
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?sort[0][field]=company&sort[0][direction]=asc`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
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
  const { token, baseId, tableId } = getAirtableConfig();
  
  if (!token || !baseId || !tableId) {
    throw new AirtableError('Airtable API credentials not configured in environment variables');
  }

  try {
    // Get all companies and find the one with matching slug
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
  const { token, baseId, tableId } = getAirtableConfig();
  
  if (!token || !baseId || !tableId) {
    throw new AirtableError('Airtable API credentials not configured in environment variables');
  }

  try {
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}/${companyId}`;
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
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
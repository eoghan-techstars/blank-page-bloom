import { Founder } from '../types/founder';

// Get configuration from environment variables
export const getFounderAirtableConfig = () => {
  return {
    token: import.meta.env.VITE_FOUNDER_ONBOARDING_AIRTABLE_API_TOKEN || '',
    baseId: import.meta.env.VITE_FOUNDER_ONBOARDING_AIRTABLE_BASE_ID || '',
    tableId: import.meta.env.VITE_FOUNDER_ONBOARDING_AIRTABLE_TABLE_ID || 'tbldVJRW3MbvxyHAv'  // Fallback to the known ID
  };
};

export const isFounderAirtableConfigured = () => {
  const { token, baseId } = getFounderAirtableConfig();
  return !!token && !!baseId;
};

class AirtableError extends Error {
  constructor(message: string, public status?: number, public details?: any) {
    super(message);
    this.name = 'AirtableError';
  }
}

export async function fetchFounders(): Promise<Founder[]> {
  const { token, baseId, tableId } = getFounderAirtableConfig();
  
  console.log('Founder Airtable Config:', {
    hasToken: !!token,
    baseId,
    tableId
  });
  
  if (!token || !baseId) {
    throw new AirtableError('Founder Airtable API credentials not configured in environment variables');
  }

  try {
    const filterByFormula = encodeURIComponent("lookbookInclude='TRUE'");
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?filterByFormula=${filterByFormula}&_=${Date.now()}`;
    
    console.log('Fetching founders from URL:', url);
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        url,
        headers: Object.fromEntries(response.headers.entries()),
        errorText
      });
      
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }
      
      throw new AirtableError(
        `Failed to fetch founders: ${response.status} ${response.statusText}`,
        response.status,
        errorDetails
      );
    }

    const data = await response.json();
    console.log('Airtable Response:', {
      recordCount: data.records?.length || 0,
      firstRecord: data.records?.[0]?.fields ? {
        name: data.records[0].fields.Name,
        hasHeadshot: !!data.records[0].fields.Headshot,
        title: data.records[0].fields.Title,
        company: data.records[0].fields['Company Name']
      } : null
    });
    
    return Promise.all(data.records.map(async (record: any) => {
      const lookbookBio = await fetchFounderLookbookBio(record.fields.Name || '');
      
      const founder = {
        id: record.id,
        name: record.fields.Name || 'Unknown',
        headshot: record.fields.Headshot?.[0]?.url || '/placeholder.svg',
        linkedinUrl: record.fields.LinkedIn || '#',
        role: record.fields.Title || '',
        company: record.fields['Company Name'] || '',
        bio: record.fields.Bio || '',
        expertise: record.fields.Expertise || [],
        email: record.fields.Email || '',
        phoneNumber: record.fields['Cell Phone Number'] || '',
        slug: createSlug(record.fields.Name || 'founder'),
        industries: record.fields['Industries of Interest'] || [],
        date: record.fields.Date || '',
        lookbookLabel: record.fields.lookbookLabel || '',
        lookbookBio,
        lookbookTag: Array.isArray(record.fields.lookbookTag) ? 
          record.fields.lookbookTag.filter((tag: string) => tag === 'Investor' || tag === 'Operator') : 
          undefined,
        // Founder-specific fields
        companyStage: record.fields['Company Stage'] || '',
        companyDescription: record.fields['Company Description'] || '',
        fundingRound: record.fields['Funding Round'] || '',
        teamSize: record.fields['Team Size'] || '',
        location: record.fields.Location || ''
      };
      
      return founder;
    }));
  } catch (error) {
    console.error('Error in fetchFounders:', error);
    if (error instanceof AirtableError) {
      throw error;
    }
    throw new AirtableError('Failed to fetch founders: Network error or invalid response');
  }
}

async function fetchFounderLookbookBio(founderName: string): Promise<string> {
  const { token, baseId, tableId } = getFounderAirtableConfig();
  
  if (!token || !baseId) {
    console.warn('Founder onboarding Airtable config not found');
    return '';
  }

  try {
    const filterByFormula = encodeURIComponent(`Name='${founderName}'`);
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?filterByFormula=${filterByFormula}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    if (!response.ok) {
      console.warn('Failed to fetch founder lookbook bio:', response.statusText);
      return '';
    }

    const data = await response.json();
    if (data.records.length === 0) {
      return '';
    }

    return data.records[0].fields.lookbookBio || '';
  } catch (error) {
    console.warn('Error fetching founder lookbook bio:', error);
    return '';
  }
}

export async function fetchFounderBySlug(slug: string): Promise<Founder | null> {
  const { token, baseId, tableId } = getFounderAirtableConfig();
  
  console.log('Fetching founder by slug:', {
    slug,
    hasToken: !!token,
    baseId,
    tableId
  });
  
  if (!token || !baseId) {
    throw new AirtableError('Founder Airtable API credentials not configured in environment variables');
  }

  try {
    // Remove lookbookInclude filter since it's not needed for founders
    const filterByFormula = encodeURIComponent(
      `Name='${slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}'`
    );
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?filterByFormula=${filterByFormula}&_=${Date.now()}`;
    
    console.log('Fetching founder from URL:', url);
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        url,
        headers: Object.fromEntries(response.headers.entries()),
        errorText
      });
      
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }
      
      throw new AirtableError(
        `Failed to fetch founder: ${response.status} ${response.statusText}`,
        response.status,
        errorDetails
      );
    }

    const data = await response.json();
    console.log('Airtable Response:', {
      recordCount: data.records?.length || 0,
      foundRecord: data.records?.[0]?.fields ? {
        name: data.records[0].fields.Name,
        hasHeadshot: !!data.records[0].fields.Headshot,
        title: data.records[0].fields.Title,
        company: data.records[0].fields['Company Name']
      } : null
    });
    
    if (data.records.length === 0) {
      console.log('No founder found for slug:', slug);
      return null;
    }

    const record = data.records[0];
    const lookbookBio = await fetchFounderLookbookBio(record.fields.Name || '');
    
    return {
      id: record.id,
      name: record.fields.Name || 'Unknown',
      headshot: record.fields.Headshot?.[0]?.url || '/placeholder.svg',
      linkedinUrl: record.fields.LinkedIn || '#',
      role: record.fields.Title || '',
      company: record.fields['Company Name'] || '',
      bio: record.fields.Bio || '',
      expertise: record.fields.Expertise || [],
      email: record.fields.Email || '',
      phoneNumber: record.fields['Cell Phone Number'] || '',
      slug: createSlug(record.fields.Name || 'founder'),
      industries: record.fields['Industries of Interest'] || [],
      date: record.fields.Date || '',
      lookbookLabel: record.fields.lookbookLabel || '',
      lookbookBio,
      lookbookTag: Array.isArray(record.fields.lookbookTag) ? 
        record.fields.lookbookTag.filter((tag: string) => tag === 'Investor' || tag === 'Operator') : 
        undefined,
      // Founder-specific fields
      companyStage: record.fields['Company Stage'] || '',
      companyDescription: record.fields['Company Description'] || '',
      fundingRound: record.fields['Funding Round'] || '',
      teamSize: record.fields['Team Size'] || '',
      location: record.fields.Location || ''
    };
  } catch (error) {
    console.error('Error in fetchFounderBySlug:', error);
    if (error instanceof AirtableError) {
      throw error;
    }
    throw new AirtableError('Failed to fetch founder by slug');
  }
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
}

export const updateFounderOnboardingField = async (founderName: string, field: string, value: string): Promise<void> => {
  const { token, baseId, tableId } = getFounderAirtableConfig();
  
  if (!token || !baseId) {
    throw new AirtableError('Founder onboarding Airtable config not configured in environment variables');
  }

  try {
    // First, get the record ID for the founder
    const filterByFormula = encodeURIComponent(`Name='${founderName}'`);
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?filterByFormula=${filterByFormula}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new AirtableError(
        `Failed to fetch founder record: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    if (data.records.length === 0) {
      throw new AirtableError('Founder record not found');
    }

    const recordId = data.records[0].id;

    // Now update the field
    const updateUrl = `https://api.airtable.com/v0/${baseId}/${tableId}/${recordId}`;
    const updateResponse = await fetch(updateUrl, {
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

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }
      
      throw new AirtableError(
        `Failed to update founder field: ${updateResponse.status} ${updateResponse.statusText}`,
        updateResponse.status,
        errorDetails
      );
    }
  } catch (error) {
    if (error instanceof AirtableError) {
      throw error;
    }
    throw new AirtableError('Failed to update founder field: Network error or invalid response');
  }
}; 
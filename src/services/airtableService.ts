import { Mentor } from '../types/mentor';

// Get configuration from environment variables
export const getAirtableConfig = () => {
  return {
    token: import.meta.env.VITE_AIRTABLE_API_TOKEN || '',
    baseId: import.meta.env.VITE_AIRTABLE_BASE_ID || '',
    tableName: import.meta.env.VITE_AIRTABLE_TABLE_NAME || 'Mentors'
  };
};

export const isAirtableConfigured = () => {
  const { token, baseId } = getAirtableConfig();
  return !!token && !!baseId;
};

class AirtableError extends Error {
  constructor(message: string, public status?: number, public details?: any) {
    super(message);
    this.name = 'AirtableError';
  }
}

export async function fetchMentors(): Promise<Mentor[]> {
  const { token, baseId, tableName } = getAirtableConfig();
  
  if (!token || !baseId) {
    throw new AirtableError('Airtable API credentials not configured in environment variables');
  }

  try {
    // Clean up the tableName in case it contains any slashes or extra path segments
    const cleanTableName = tableName.split('/')[0].split('?')[0].trim();
    
    // Add filter for lookbookLabel field
    const filterByFormula = encodeURIComponent("lookbookLabel='MM'");
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(cleanTableName)}?filterByFormula=${filterByFormula}&_=${Date.now()}`;
    
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
        `Failed to fetch mentors: ${response.status} ${response.statusText}`,
        response.status,
        errorDetails
      );
    }

    const data = await response.json();
    
    // Log the raw lookbookTag values from Airtable with more detail
    console.log('Raw lookbookTag values from Airtable:', 
      data.records.map((record: any) => ({
        name: record.fields.Name,
        lookbookTag: record.fields.lookbookTag,
        rawFields: record.fields // Log all fields to see what we're getting
      }))
    );
    
    return data.records.map((record: any) => {
      // Log the exact value we're checking
      console.log(`Processing mentor ${record.fields.Name}:`, {
        rawLookbookTag: record.fields.lookbookTag,
        isInvestor: record.fields.lookbookTag === 'Investor',
        isOperator: record.fields.lookbookTag === 'Operator'
      });

      const mentor = {
        id: record.id,
        name: record.fields.Name || 'Unknown',
        headshot: record.fields.Headshot?.[0]?.url || '/placeholder.svg',
        linkedinUrl: record.fields.LinkedIn || '#',
        role: record.fields.Role || '',
        company: record.fields.Company || '',
        bio: record.fields.Bio || '',
        expertise: record.fields.Expertise || [],
        email: record.fields.Email || '',
        phoneNumber: record.fields.phoneNumber || '',
        slug: createSlug(record.fields.Name || 'mentor'),
        industries: record.fields['Industries of Interest'] || [],
        date: record.fields.Date || '',
        lookbookLabel: record.fields.lookbookLabel || '',
        lookbookTag: Array.isArray(record.fields.lookbookTag) ? 
          record.fields.lookbookTag.filter((tag: string) => tag === 'Investor' || tag === 'Operator') : 
          undefined
      };
      
      return mentor;
    });
  } catch (error) {
    if (error instanceof AirtableError) {
      throw error;
    }
    throw new AirtableError('Failed to fetch mentors: Network error or invalid response');
  }
}

export async function fetchMentorBySlug(slug: string): Promise<Mentor | null> {
  const { token, baseId, tableName } = getAirtableConfig();
  
  if (!token || !baseId) {
    throw new AirtableError('Airtable API credentials not configured in environment variables');
  }

  try {
    // Clean up the tableName in case it contains any slashes or extra path segments
    const cleanTableName = tableName.split('/')[0].split('?')[0].trim();
    
    // Clean up the name from the slug, handling special characters and extra spaces
    const nameFromSlug = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ')    // Replace multiple spaces with single space
      .trim();                 // Trim leading/trailing spaces
    
    // Search for mentor in both labels with more flexible name matching
    const filterByFormula = encodeURIComponent(
      `AND(OR(lookbookLabel='MM', lookbookLabel='AM'), LOWER(TRIM(REGEX_REPLACE(Name, '[^a-zA-Z0-9\\s]', '')))='${nameFromSlug.toLowerCase()}')`
    );
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(cleanTableName)}?filterByFormula=${filterByFormula}&_=${Date.now()}`;
    
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
        `Failed to fetch mentor: ${response.status} ${response.statusText}`,
        response.status,
        errorDetails
      );
    }

    const data = await response.json();
    
    if (data.records.length === 0) {
      return null;
    }

    const record = data.records[0];
    return {
      id: record.id,
      name: record.fields.Name || 'Unknown',
      headshot: record.fields.Headshot?.[0]?.url || '/placeholder.svg',
      linkedinUrl: record.fields.LinkedIn || '#',
      role: record.fields.Role || '',
      company: record.fields.Company || '',
      bio: record.fields.Bio || '',
      expertise: record.fields.Expertise || [],
      email: record.fields.Email || '',
      phoneNumber: record.fields.phoneNumber || '',
      slug: createSlug(record.fields.Name || 'mentor'),
      industries: record.fields['Industries of Interest'] || [],
      date: record.fields.Date || '',
      lookbookLabel: record.fields.lookbookLabel || '',
      lookbookTag: Array.isArray(record.fields.lookbookTag) ? 
        record.fields.lookbookTag.filter((tag: string) => tag === 'Investor' || tag === 'Operator') : 
        undefined
    };
  } catch (error) {
    if (error instanceof AirtableError) {
      throw error;
    }
    throw new AirtableError('Failed to fetch mentor by slug');
  }
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
}

export async function submitMentorFeedback(
  mentorId: string,
  company: string,
  feedbackType: 'thumbsUp' | 'thumbsNeutral'
): Promise<boolean> {
  const { token, baseId, tableName } = getAirtableConfig();
  
  if (!token || !baseId) {
    throw new AirtableError('Airtable API credentials not configured in environment variables');
  }

  try {
    // Clean up the tableName in case it contains any slashes or extra path segments
    const cleanTableName = tableName.split('/')[0].split('?')[0].trim();
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(cleanTableName)}/${mentorId}`;
    
    // Get current record data
    const getResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!getResponse.ok) {
      const errorText = await getResponse.text();
      console.error('Airtable API Error Details:', {
        status: getResponse.status,
        statusText: getResponse.statusText,
        url,
        headers: Object.fromEntries(getResponse.headers.entries()),
        errorText
      });
      
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }
      
      throw new AirtableError(
        `Failed to fetch mentor record: ${getResponse.status} ${getResponse.statusText}`,
        getResponse.status,
        errorDetails
      );
    }

    const record = await getResponse.json();
    console.log('Retrieved Airtable record:', record);
    
    // Match the exact field names as in Airtable
    // "Renn thumbs up", "Renn thumbs neutral", etc.
    const fieldName = `${company} thumbs ${feedbackType === 'thumbsUp' ? 'up' : 'neutral'}`;
    console.log('Using field name:', fieldName);
    
    // Get current value to toggle it
    const currentValue = record.fields[fieldName] === true;
    const newValue = !currentValue; // Toggle between true and false
    
    console.log(`Toggling field ${fieldName} from ${currentValue} to ${newValue}`);
    
    // Update the record with the toggled value
    const updateResponse = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          [fieldName]: newValue
        }
      })
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Airtable update error details:', errorText);
      
      throw new AirtableError(
        `Failed to update mentor record: ${updateResponse.status} ${updateResponse.statusText}`,
        updateResponse.status,
        errorText
      );
    }

    const updateData = await updateResponse.json();
    console.log('Update successful:', updateData);
    
    return newValue; // Return the new value so the component knows if it's checked or unchecked
  } catch (error) {
    console.error('Error in submitMentorFeedback:', error);
    if (error instanceof AirtableError) {
      throw error;
    }
    throw new AirtableError('Failed to submit mentor feedback: Network error or invalid response');
  }
}

export async function fetchAdditionalMentors(): Promise<Mentor[]> {
  const { token, baseId, tableName } = getAirtableConfig();
  
  if (!token || !baseId) {
    throw new AirtableError('Airtable API credentials not configured in environment variables');
  }

  try {
    // Clean up the tableName in case it contains any slashes or extra path segments
    const cleanTableName = tableName.split('/')[0].split('?')[0].trim();
    
    // Add filter for lookbookLabel field
    const filterByFormula = encodeURIComponent("lookbookLabel='AM'");
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(cleanTableName)}?filterByFormula=${filterByFormula}&_=${Date.now()}`;
    
    console.log('Airtable API Request:', {
      url,
      baseId,
      tableName: cleanTableName,
      filterByFormula
    });
    
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
        `Failed to fetch additional mentors: ${response.status} ${response.statusText}`,
        response.status,
        errorDetails
      );
    }

    const data = await response.json();
    
    // Log the raw lookbookTag values from Airtable with more detail
    console.log('Raw lookbookTag values from Airtable:', 
      data.records.map((record: any) => ({
        name: record.fields.Name,
        lookbookTag: record.fields.lookbookTag,
        rawFields: record.fields // Log all fields to see what we're getting
      }))
    );
    
    return data.records.map((record: any) => {
      // Log the exact value we're checking
      console.log(`Processing mentor ${record.fields.Name}:`, {
        rawLookbookTag: record.fields.lookbookTag,
        isInvestor: record.fields.lookbookTag === 'Investor',
        isOperator: record.fields.lookbookTag === 'Operator'
      });

      const mentor = {
        id: record.id,
        name: record.fields.Name || 'Unknown',
        headshot: record.fields.Headshot?.[0]?.url || '/placeholder.svg',
        linkedinUrl: record.fields.LinkedIn || '#',
        role: record.fields.Role || '',
        company: record.fields.Company || '',
        bio: record.fields.Bio || '',
        expertise: record.fields.Expertise || [],
        email: record.fields.Email || '',
        phoneNumber: record.fields.phoneNumber || '',
        slug: createSlug(record.fields.Name || 'mentor'),
        industries: record.fields['Industries of Interest'] || [],
        date: record.fields.Date || '',
        lookbookLabel: record.fields.lookbookLabel || '',
        lookbookTag: Array.isArray(record.fields.lookbookTag) ? 
          record.fields.lookbookTag.filter((tag: string) => tag === 'Investor' || tag === 'Operator') : 
          undefined
      };
      
      return mentor;
    });
  } catch (error) {
    if (error instanceof AirtableError) {
      throw error;
    }
    throw new AirtableError('Failed to fetch additional mentors: Network error or invalid response');
  }
}

export async function listTables(): Promise<void> {
  const { token, baseId } = getAirtableConfig();
  
  if (!token || !baseId) {
    console.error('Missing Airtable configuration:', { token: !!token, baseId: !!baseId });
    throw new AirtableError('Airtable API credentials not configured in environment variables');
  }

  try {
    const url = `https://api.airtable.com/v0/${baseId}/tables`;
    console.log('Attempting to fetch tables with:', {
      url,
      baseId,
      tokenPrefix: token.substring(0, 10) + '...'
    });
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to list tables:', {
        status: response.status,
        statusText: response.statusText,
        url,
        headers: Object.fromEntries(response.headers.entries()),
        errorText
      });
      return;
    }

    const data = await response.json();
    console.log('Successfully fetched tables:', {
      count: data.tables?.length || 0,
      tableNames: data.tables?.map((table: any) => table.name) || []
    });
  } catch (error) {
    console.error('Error listing tables:', error);
  }
}

export async function testAirtableAccess(): Promise<void> {
  const { token, baseId } = getAirtableConfig();
  
  if (!token || !baseId) {
    console.error('Missing Airtable configuration:', { 
      hasToken: !!token, 
      hasBaseId: !!baseId,
      tokenPrefix: token ? token.substring(0, 10) + '...' : 'none',
      baseId: baseId || 'none'
    });
    throw new AirtableError('Airtable API credentials not configured in environment variables');
  }

  try {
    // First try to get base info
    const baseUrl = `https://api.airtable.com/v0/${baseId}`;
    console.log('Testing Airtable access with:', {
      baseUrl,
      tokenPrefix: token.substring(0, 10) + '...'
    });
    
    const response = await fetch(baseUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: baseUrl,
        headers: Object.fromEntries(response.headers.entries()),
        errorText
      });
      throw new AirtableError(`Failed to access Airtable base: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Successfully accessed Airtable base:', {
      name: data.name,
      tables: data.tables?.map((t: any) => t.name) || []
    });
  } catch (error) {
    console.error('Error testing Airtable access:', error);
    throw error;
  }
}


import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
        status: 204,
      });
    }

    // Safely parse the request body
    let type;
    try {
      if (req.body) {
        const body = await req.text();
        console.log("Request body:", body);
        
        if (body && body.trim() !== '') {
          const data = JSON.parse(body);
          type = data.type;
        }
      }
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return new Response(JSON.stringify({ 
        error: `Failed to parse request body: ${parseError.message}`,
        timestamp: new Date().toISOString() 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Ensure we have a valid type
    if (!type) {
      console.log("No type specified, defaulting to 'mentors'");
      type = 'mentors'; // Default to mentors if no type is specified
    }
    
    const configs = {
      mentors: {
        token: Deno.env.get("AIRTABLE_API_TOKEN"),
        baseId: Deno.env.get("AIRTABLE_BASE_ID"),
        tableName: Deno.env.get("AIRTABLE_TABLE_NAME")
      },
      founders: {
        token: Deno.env.get("FOUNDER_AIRTABLE_API_TOKEN"),
        baseId: Deno.env.get("FOUNDER_AIRTABLE_BASE_ID"),
        tableId: Deno.env.get("FOUNDER_AIRTABLE_TABLE_ID")
      },
      companies: {
        token: Deno.env.get("COMPANY_AIRTABLE_API_TOKEN"),
        baseId: Deno.env.get("COMPANY_AIRTABLE_BASE_ID"),
        tableId: Deno.env.get("COMPANY_AIRTABLE_TABLE_ID")
      },
      founderOnboarding: {
        token: Deno.env.get("FOUNDER_ONBOARDING_AIRTABLE_API_TOKEN"),
        baseId: Deno.env.get("FOUNDER_ONBOARDING_AIRTABLE_BASE_ID"),
        tableId: Deno.env.get("FOUNDER_ONBOARDING_AIRTABLE_TABLE_ID")
      }
    };

    // Log the request type and config keys being requested
    console.log(`Received request for config type: ${type}`);
    console.log(`Available config keys: ${Object.keys(configs).join(', ')}`);
    
    const config = configs[type as keyof typeof configs];
    if (!config) {
      const errorMsg = `Invalid configuration type requested: ${type}`;
      console.error(errorMsg);
      return new Response(JSON.stringify({ 
        error: errorMsg,
        availableTypes: Object.keys(configs),
        timestamp: new Date().toISOString() 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Check if we have all the necessary environment variables
    if (!config.token || !config.baseId || (!config.tableName && !config.tableId)) {
      console.error(`Missing required environment variables for ${type} configuration`);
      
      // Log which variables are missing to help debugging
      const missing = [];
      if (!config.token) missing.push(type === 'mentors' ? 'AIRTABLE_API_TOKEN' : `${type.toUpperCase()}_AIRTABLE_API_TOKEN`);
      if (!config.baseId) missing.push(type === 'mentors' ? 'AIRTABLE_BASE_ID' : `${type.toUpperCase()}_AIRTABLE_BASE_ID`);
      if (!config.tableName && !config.tableId) missing.push(type === 'mentors' ? 'AIRTABLE_TABLE_NAME' : `${type.toUpperCase()}_AIRTABLE_TABLE_ID`);
      
      return new Response(JSON.stringify({ 
        error: 'Airtable configuration not complete',
        missing,
        timestamp: new Date().toISOString() 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Log the config being returned (without showing full token)
    const safeConfig = { ...config };
    if (safeConfig.token) {
      safeConfig.token = safeConfig.token?.substring(0, 5) + '...' || 'undefined';
    }
    console.log(`Returning ${type} config:`, safeConfig);

    return new Response(JSON.stringify(config), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error in get-airtable-config:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      type: "error",
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

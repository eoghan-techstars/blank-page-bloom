
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  try {
    const { type } = await req.json();
    
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

    const config = configs[type as keyof typeof configs];
    if (!config) {
      throw new Error("Invalid configuration type requested");
    }

    // Log the config being returned (without showing full token)
    const safeConfig = { ...config };
    if (safeConfig.token) {
      safeConfig.token = safeConfig.token.substring(0, 10) + '...';
    }
    console.log(`Returning ${type} config:`, safeConfig);

    return new Response(JSON.stringify(config), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in get-airtable-config:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});

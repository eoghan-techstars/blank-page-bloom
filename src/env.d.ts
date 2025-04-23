/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AIRTABLE_API_TOKEN: string
  readonly VITE_AIRTABLE_BASE_ID: string
  readonly VITE_AIRTABLE_TABLE_NAME: string
  readonly VITE_FOUNDER_AIRTABLE_API_TOKEN: string
  readonly VITE_FOUNDER_AIRTABLE_BASE_ID: string
  readonly VITE_FOUNDER_AIRTABLE_TABLE_ID: string
  readonly VITE_FOUNDER_ONBOARDING_AIRTABLE_API_TOKEN: string
  readonly VITE_FOUNDER_ONBOARDING_AIRTABLE_BASE_ID: string
  readonly VITE_FOUNDER_ONBOARDING_AIRTABLE_TABLE_ID: string
  readonly VITE_COMPANY_AIRTABLE_API_TOKEN: string
  readonly VITE_COMPANY_AIRTABLE_BASE_ID: string
  readonly VITE_COMPANY_AIRTABLE_TABLE_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 

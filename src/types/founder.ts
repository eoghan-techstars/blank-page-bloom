export interface Founder {
  id: string;
  name: string;
  headshot: string;
  linkedinUrl: string;
  role: string;
  company: string;
  bio: string;
  expertise: string[];
  email: string;
  phoneNumber: string;
  slug: string;
  industries: string[];
  date: string;
  lookbookLabel: string;
  lookbookTag: ('Investor' | 'Operator')[] | undefined;
  lookbookBio: string;
  // Founder-specific fields
  companyStage: string;
  companyDescription: string;
  fundingRound: string;
  teamSize: string;
  location: string;
} 
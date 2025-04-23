import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchFounderBySlug } from '../services/founderAirtableService';
import { fetchCompanyBySlug } from '../services/companyAirtableService';
import { Founder } from '../types/founder';
import { Company } from '../types/company';
import Navbar from '../components/Navbar';
import AnimatedPageTransition from '../components/AnimatedPageTransition';
import CompanyHeader from '../components/CompanyHeader';
import FoundersList from '../components/FoundersList';
import { ArrowLeft } from 'lucide-react';

const CompanyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [founderError, setFounderError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanyAndFounders = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const companyData = await fetchCompanyBySlug(slug);
        setCompany(companyData);
        
        if (!companyData) {
          setError('Company not found');
          return;
        }

        // Parse founder names from the company's founders field
        const founderNames = companyData.founders
          .split(',')
          .map(name => name.trim())
          .filter(Boolean);

        // Fetch details for each founder
        const founderPromises = founderNames.map(async (name) => {
          try {
            const founderSlug = name.toLowerCase().replace(/\s+/g, '-');
            const founderData = await fetchFounderBySlug(founderSlug);
            return founderData;
          } catch (err) {
            console.error(`Error fetching founder ${name}:`, err);
            return null;
          }
        });

        const founderResults = await Promise.all(founderPromises);
        const validFounders = founderResults.filter((f): f is Founder => f !== null);
        setFounders(validFounders);

        if (validFounders.length === 0 && founderNames.length > 0) {
          setFounderError('Unable to load founder details');
        }

      } catch (err) {
        setError('Failed to load company details. Please try again later.');
        console.error('Error loading company:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCompanyAndFounders();
  }, [slug]);

  return (
    <AnimatedPageTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navbar />
        
        <main className="max-w-5xl mx-auto px-6 md:px-12 pb-20 mt-24">
          <Link 
            to="/companies" 
            className="inline-flex items-center py-2 px-4 mb-8 text-sm hover:text-techstars-phosphor transition-colors duration-300"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to all companies
          </Link>

          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-techstars-phosphor rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-20">{error}</div>
          ) : company ? (
            <div className="space-y-8">
              <CompanyHeader company={company} />
              {founderError ? (
                <div className="text-center text-yellow-500 py-4">{founderError}</div>
              ) : (
                <FoundersList founders={founders} />
              )}
            </div>
          ) : (
            <div className="text-center text-techstars-slate py-20">Company not found</div>
          )}
        </main>
        
        <footer className="py-8 border-t border-gray-100 text-center text-sm text-techstars-slate">
          <div className="max-w-7xl mx-auto px-6">
            <p>© {new Date().getFullYear()} Techstars London. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </AnimatedPageTransition>
  );
};

export default CompanyDetail; 
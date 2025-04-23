import { useEffect, useState } from 'react';
import { fetchCompanies } from '../services/companyAirtableService';
import { Company } from '../types/company';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import AnimatedPageTransition from '../components/AnimatedPageTransition';
import CompanyCard from '../components/CompanyCard';

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoading(true);
        const data = await fetchCompanies();
        setCompanies(data);
      } catch (err) {
        setError('Failed to load companies. Please try again later.');
        console.error('Error loading companies:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  return (
    <AnimatedPageTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-6 md:px-12 pb-48 pt-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Techstars Companies</h1>
            <p className="text-techstars-slate text-lg max-w-2xl mx-auto">
              Discover the innovative companies building the future through Techstars London.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-techstars-phosphor rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-20">{error}</div>
          ) : (
            <>
              {companies.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {companies.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-techstars-slate py-20">
                  No companies found.
                </div>
              )}
            </>
          )}
        </main>
        
        <BottomNav />
      </div>
    </AnimatedPageTransition>
  );
};

export default Companies; 
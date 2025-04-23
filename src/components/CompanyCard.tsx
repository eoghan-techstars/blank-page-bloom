import { Link } from 'react-router-dom';
import { Company } from '../types/company';
import { Linkedin, Globe } from 'lucide-react';
import { createSlug } from '../services/companyAirtableService';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard = ({ company }: CompanyCardProps) => {
  const firstLetter = company.company.charAt(0).toUpperCase();
  const slug = createSlug(company.lookbookCompanyName);

  return (
    <Link
      to={`/companies/${slug}`}
      className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {company.logo ? (
          <img 
            src={company.logo} 
            alt={`${company.company} logo`}
            className="w-4/5 h-4/5 object-contain mx-auto my-auto absolute inset-0"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
              const letterDiv = document.createElement('div');
              letterDiv.className = 'text-8xl font-bold text-gray-400';
              letterDiv.textContent = firstLetter;
              target.parentElement?.appendChild(letterDiv);
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-8xl font-bold text-gray-400">{firstLetter}</span>
          </div>
        )}
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-semibold">{company.company}</h3>
          <p className="text-sm opacity-90 mb-2">{company.oneLiner}</p>
          {(company.introductionsNeeded || company.specificSupport) && (
            <div className="text-sm">
              <p className="font-medium mb-1">Looking for help with:</p>
              <ul className="list-disc pl-4 space-y-1 opacity-90">
                {company.introductionsNeeded && (
                  <li><span className="font-medium">Introductions to:</span> {company.introductionsNeeded}</li>
                )}
                {company.specificSupport && (
                  <li><span className="font-medium">Specific support with:</span> {company.specificSupport}</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CompanyCard; 
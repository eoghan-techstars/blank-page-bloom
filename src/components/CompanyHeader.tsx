import { Company } from '../types/company';
import { Linkedin, Globe, HelpCircle, Save, FileText } from 'lucide-react';
import { useState } from 'react';
import { updateCompanyField } from '../services/companyAirtableService';

interface CompanyHeaderProps {
  company: Company;
}

const CompanyHeader = ({ company }: CompanyHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [introductions, setIntroductions] = useState(company.introductionsNeeded || '');
  const [support, setSupport] = useState(company.specificSupport || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const hasAsks = company.introductionsNeeded || company.specificSupport;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (introductions !== company.introductionsNeeded) {
        await updateCompanyField(company.id, 'introductionsNeeded', introductions);
      }
      if (support !== company.specificSupport) {
        await updateCompanyField(company.id, 'specificSupport', support);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save company asks:', error);
      // You might want to add error handling UI here
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-center gap-6 mb-6">
        <div className="overflow-hidden rounded-xl shadow-lg relative">
          {company.logo ? (
            <img 
              src={company.logo} 
              alt={`${company.company} logo`}
              className="w-24 h-24 object-contain bg-gradient-to-br from-gray-50 to-gray-100 p-8"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                const letterDiv = document.createElement('div');
                letterDiv.className = 'text-8xl font-bold text-gray-400';
                letterDiv.textContent = company.company.charAt(0);
                target.parentElement?.appendChild(letterDiv);
              }}
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <span className="text-8xl font-bold text-gray-400">{company.company.charAt(0)}</span>
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{company.company}</h1>
          <p className="text-techstars-slate text-lg">{company.oneLiner}</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HelpCircle size={20} className="text-techstars-phosphor" />
              <h3 className="text-xl font-semibold text-gray-900">Looking for help with:</h3>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-techstars-phosphor hover:text-techstars-phosphor-dark transition-colors"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-2 text-white bg-techstars-phosphor hover:bg-techstars-phosphor-dark transition-colors px-4 py-2 rounded-md ${
                  isSaving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Introductions needed:
              </label>
              {isEditing ? (
                <textarea
                  value={introductions}
                  onChange={(e) => setIntroductions(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-techstars-phosphor focus:border-transparent"
                  rows={3}
                  placeholder="What introductions would be helpful?"
                />
              ) : (
                introductions && (
                  <p className="text-gray-700">{introductions}</p>
                )
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specific support needed:
              </label>
              {isEditing ? (
                <textarea
                  value={support}
                  onChange={(e) => setSupport(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-techstars-phosphor focus:border-transparent"
                  rows={3}
                  placeholder="What specific support would be helpful?"
                />
              ) : (
                support && (
                  <p className="text-gray-700">{support}</p>
                )
              )}
            </div>
          </div>
        </div>

        <div className="border-t pt-6 flex gap-4">
          {company.companyLinkedIn && (
            <a
              href={company.companyLinkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-techstars-slate hover:text-techstars-phosphor transition-colors"
            >
              <Linkedin size={20} />
              <span>Company LinkedIn</span>
            </a>
          )}
          {company.URL && (
            <a
              href={company.URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-techstars-slate hover:text-techstars-phosphor transition-colors"
            >
              <Globe size={20} />
              <span>Company Website</span>
            </a>
          )}
          {company.notionInvestmentMemo && (
            <a
              href={company.notionInvestmentMemo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-techstars-slate hover:text-techstars-phosphor transition-colors"
            >
              <FileText size={20} />
              <span>Investment Memo</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader; 
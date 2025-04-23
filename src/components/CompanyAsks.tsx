import { Company } from '../types/company';

interface CompanyAsksProps {
  company: Company;
}

const CompanyAsks = ({ company }: CompanyAsksProps) => {
  if (!company.introductionsNeeded && !company.specificSupport) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Looking for help with:</h3>
      <ul className="list-disc pl-5 space-y-2 text-gray-700">
        {company.introductionsNeeded && (
          <li>
            <span className="font-medium">Introductions to:</span> {company.introductionsNeeded}
          </li>
        )}
        {company.specificSupport && (
          <li>
            <span className="font-medium">Specific support with:</span> {company.specificSupport}
          </li>
        )}
      </ul>
    </div>
  );
};

export default CompanyAsks; 
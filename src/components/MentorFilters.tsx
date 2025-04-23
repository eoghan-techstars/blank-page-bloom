import { X } from 'lucide-react';

interface MentorFiltersProps {
  expertise: string[];
  industries: string[];
  selectedExpertise: string[];
  selectedIndustries: string[];
  onExpertiseChange: (expertise: string) => void;
  onIndustryChange: (industry: string) => void;
  onClearFilters: () => void;
}

const MentorFilters: React.FC<MentorFiltersProps> = ({
  expertise,
  industries,
  selectedExpertise,
  selectedIndustries,
  onExpertiseChange,
  onIndustryChange,
  onClearFilters
}) => {
  const hasActiveFilters = selectedExpertise.length > 0 || selectedIndustries.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-techstars-slate hover:text-techstars-phosphor flex items-center gap-1"
          >
            <X size={14} />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {expertise.map((skill) => (
              <button
                key={skill}
                onClick={() => onExpertiseChange(skill)}
                className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                  selectedExpertise.includes(skill)
                    ? 'bg-techstars-phosphor text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Industries</h3>
          <div className="flex flex-wrap gap-2">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => onIndustryChange(industry)}
                className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                  selectedIndustries.includes(industry)
                    ? 'bg-techstars-phosphor text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorFilters; 
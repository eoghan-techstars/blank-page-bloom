import { useMemo } from 'react';
import { Mentor } from '../../types/mentor';
import MentorCard from '../../components/MentorCard';

interface MentorGridProps {
  mentors: Mentor[];
  loading: boolean;
  error: string | null;
  selectedTags: string[];
  selectedDate: string | null;
}

const MentorGrid = ({ mentors, loading, error, selectedTags, selectedDate }: MentorGridProps) => {
  // Filter mentors based on selected tags and date
  const filteredMentors = useMemo(() => {
    let filtered = mentors;

    // Apply date filter
    if (selectedDate) {
      filtered = filtered.filter(mentor => mentor.date === selectedDate);
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(mentor => {
        return selectedTags.every(tag => mentor.lookbookTag?.includes(tag as 'Investor' | 'Operator'));
      });
    }

    return filtered;
  }, [mentors, selectedTags, selectedDate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-techstars-phosphor rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-6 bg-red-50 rounded-lg min-h-[300px]">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-2">{error}</p>
          <p className="text-sm text-gray-600">Please check your Airtable configuration in the .env file</p>
        </div>
      </div>
    );
  }
  
  if (filteredMentors.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg min-h-[300px]">
        <div className="text-center">
          <p className="text-techstars-slate font-medium mb-2">No mentors found with status "Booked - March 2025"</p>
          <p className="text-sm text-gray-600">Update mentor status in Airtable to see them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[400px]">
      {filteredMentors.map((mentor, index) => (
        <MentorCard key={mentor.id} mentor={mentor} index={index} />
      ))}
    </div>
  );
};

export default MentorGrid;

import { useState, useEffect } from 'react';
import { ThumbsUp, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { submitMentorFeedback } from '../services/airtableService';

interface MentorFeedbackProps {
  mentorId: string;
  mentorName: string;
}

const companies = [
  'Renn',
  'Alethica',
  'PrettyData',
  'Solim',
  'Tova',
  'Parasol',
  'Ovida'
];

export default function MentorFeedback({ mentorId, mentorName }: MentorFeedbackProps) {
  const [loadingStatus, setLoadingStatus] = useState<Record<string, Record<string, boolean>>>({});
  const [activeStatus, setActiveStatus] = useState<Record<string, Record<string, boolean>>>({});

  const handleFeedback = async (company: string, feedbackType: 'thumbsUp' | 'thumbsNeutral') => {
    // Set loading state for this button
    setLoadingStatus(prev => ({
      ...prev,
      [company]: {
        ...(prev[company] || {}),
        [feedbackType]: true
      }
    }));
    
    try {
      // submitMentorFeedback now returns the new state (true if checked, false if unchecked)
      const isActive = await submitMentorFeedback(mentorId, company, feedbackType);
      
      // Update active status based on response
      setActiveStatus(prev => ({
        ...prev,
        [company]: {
          ...(prev[company] || {}),
          [feedbackType]: isActive
        }
      }));

      // Show appropriate toast message
      if (isActive) {
        toast.success(`Thanks for your ${feedbackType === 'thumbsUp' ? 'positive' : 'neutral'} feedback!`);
      } else {
        toast.success('Feedback removed');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Log more detailed information about the error
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        if ('details' in error) {
          console.error('API Error details:', (error as any).details);
        }
      }
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      // Clear loading state
      setLoadingStatus(prev => ({
        ...prev,
        [company]: {
          ...(prev[company] || {}),
          [feedbackType]: false
        }
      }));
    }
  };

  const isLoading = (company: string, feedbackType: 'thumbsUp' | 'thumbsNeutral') => {
    return loadingStatus[company]?.[feedbackType] || false;
  };

  const isActive = (company: string, feedbackType: 'thumbsUp' | 'thumbsNeutral') => {
    return activeStatus[company]?.[feedbackType] || false;
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {companies.map((company) => (
          <div key={company} className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium">{company}</h3>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleFeedback(company, 'thumbsUp')}
                  disabled={isLoading(company, 'thumbsUp')}
                  className={`flex items-center justify-center gap-1 py-1 px-2 rounded-md ${
                    isActive(company, 'thumbsUp')
                      ? 'bg-green-100 text-green-700 ring-1 ring-green-600'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  } transition-colors duration-200 disabled:opacity-50 text-xs`}
                >
                  {isLoading(company, 'thumbsUp') ? (
                    <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                  ) : isActive(company, 'thumbsUp') ? (
                    <Check size={14} />
                  ) : (
                    <ThumbsUp size={14} />
                  )}
                  <span>Yes</span>
                </button>
                
                <button
                  onClick={() => handleFeedback(company, 'thumbsNeutral')}
                  disabled={isLoading(company, 'thumbsNeutral')}
                  className={`flex items-center justify-center gap-1 py-1 px-2 rounded-md ${
                    isActive(company, 'thumbsNeutral')
                      ? 'bg-gray-200 text-gray-700 ring-1 ring-gray-500'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  } transition-colors duration-200 disabled:opacity-50 text-xs`}
                >
                  {isLoading(company, 'thumbsNeutral') ? (
                    <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  ) : isActive(company, 'thumbsNeutral') ? (
                    <Check size={14} />
                  ) : (
                    <ArrowRight size={14} />
                  )}
                  <span>Maybe</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
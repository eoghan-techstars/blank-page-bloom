import { useState, useEffect, useMemo } from 'react';
import { fetchMentors, listTables } from '../../../services/airtableService';
import { Mentor } from '../../../types/mentor';
import { toast } from 'sonner';
import { useAirtableConfig } from '../../../hooks/useAirtableConfig';

export const useMentorsData = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const { config, loading: configLoading, error: configError } = useAirtableConfig('mentors');

  const loadMentors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (configLoading) {
        console.log('Waiting for Airtable config to load...');
        return;
      }
      
      if (configError) {
        setError(`Configuration error: ${configError}`);
        toast.error('Failed to load Airtable configuration');
        return;
      }
      
      if (config && config.token && config.baseId) {
        console.log('Checking Airtable configuration...');
        await listTables(); // List tables first to verify API access
        console.log('Fetching mentors...');
        const data = await fetchMentors();
        setMentors(data);
      } else {
        const error = 'Airtable API credentials not configured or missing';
        console.error(error);
        setError(error);
        toast.error(error);
      }
    } catch (err: any) {
      console.error('Error loading mentors:', err);
      setError('Failed to load mentors: ' + (err.message || 'Unknown error'));
      toast.error('Failed to load mentors. Please check your configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!configLoading && config) {
      loadMentors();
    }
  }, [config, configLoading]);

  const availableDates = useMemo(() => {
    const dateSet = new Set<string>();
    mentors.forEach(mentor => {
      if (mentor.date) dateSet.add(mentor.date);
    });
    return Array.from(dateSet).sort();
  }, [mentors]);

  const allTags = useMemo(() => {
    const tagSet = new Set<'Investor' | 'Operator'>();
    mentors.forEach(mentor => {
      if (mentor.lookbookTag) {
        mentor.lookbookTag.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  }, [mentors]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSelectedDate(null);
  };

  return {
    mentors,
    loading: loading || configLoading,
    error,
    selectedTags,
    selectedDate,
    setSelectedDate,
    allTags,
    availableDates,
    handleTagToggle,
    handleClearFilters,
    loadMentors
  };
};

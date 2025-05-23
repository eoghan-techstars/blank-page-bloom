import Navbar from '../components/Navbar';
import AnimatedPageTransition from '../components/AnimatedPageTransition';
import FloatingFilterBar from '../components/FloatingFilterBar';
import PageHeader from './index/PageHeader';
import MentorGrid from './index/MentorGrid';
import BottomNav from '../components/BottomNav';
import { useMentorsData } from './index/hooks/useMentorsData';

const Index = () => {
  const {
    mentors,
    loading,
    error,
    selectedTags,
    selectedDate,
    setSelectedDate,
    allTags,
    availableDates,
    handleTagToggle,
    handleClearFilters,
    loadMentors
  } = useMentorsData();

  return (
    <AnimatedPageTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-6 md:px-12 pb-48 pt-24">
          <PageHeader onRefresh={loadMentors} loading={loading} />
          <h2 className="text-3xl font-bold text-techstars-slate mb-8 text-center">Mentor Magic</h2>
          <MentorGrid 
            mentors={mentors}
            loading={loading}
            error={error}
            selectedTags={selectedTags}
            selectedDate={selectedDate}
          />
        </main>
        
        <BottomNav />

        {/* Floating Filter Bar */}
        <FloatingFilterBar
          allTags={allTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          availableDates={availableDates}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onClearFilters={handleClearFilters}
        />
      </div>
    </AnimatedPageTransition>
  );
};

export default Index;

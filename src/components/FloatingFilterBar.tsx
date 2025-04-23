import { useState } from 'react';
import { Calendar, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface FloatingFilterBarProps {
  allTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableDates: string[];
  selectedDate: string | null;
  onDateSelect: (date: string | null) => void;
  onClearFilters: () => void;
}

const FloatingFilterBar: React.FC<FloatingFilterBarProps> = ({
  allTags,
  selectedTags,
  onTagToggle,
  availableDates,
  selectedDate,
  onDateSelect,
  onClearFilters
}) => {
  const [showAllTags, setShowAllTags] = useState(false);
  const isMobile = useIsMobile();
  const hasActiveFilters = selectedTags.length > 0 || selectedDate !== null;

  // For mobile devices, use a drawer
  if (isMobile) {
    return (
      <div className="fixed bottom-[60px] inset-x-4 z-50">
        <div className="flex gap-2 justify-between">
          {hasActiveFilters && (
            <Button 
              onClick={onClearFilters}
              variant="outline"
              className="bg-white border-gray-200 shadow-md flex-1"
            >
              <X size={16} className="mr-2" />
              Clear filters
            </Button>
          )}

          <Drawer>
            <DrawerTrigger asChild>
              <Button className="shadow-lg flex-1">
                <Filter size={16} className="mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 bg-white text-techstars-phosphor w-5 h-5 rounded-full text-xs flex items-center justify-center">
                    {selectedTags.length + (selectedDate ? 1 : 0)}
                  </span>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent className="px-4 pb-8">
              <DrawerHeader>
                <DrawerTitle>Filters</DrawerTitle>
                <DrawerDescription>
                  Filter mentors by date or tag
                </DrawerDescription>
              </DrawerHeader>
              
              {/* Date Filter */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-gray-700">Filter by date</h2>
                  {selectedDate && (
                    <button
                      onClick={() => onDateSelect(null)}
                      className="text-sm text-techstars-slate hover:text-techstars-phosphor flex items-center gap-1"
                    >
                      <X size={14} />
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => onDateSelect(date)}
                      className={`px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                        selectedDate === date
                          ? 'bg-techstars-phosphor text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-gray-700">Filter by tag</h2>
                  {allTags.length > 8 && (
                    <button
                      onClick={() => setShowAllTags(!showAllTags)}
                      className="text-sm text-techstars-phosphor hover:text-techstars-phosphor/80 flex items-center gap-1"
                    >
                      {showAllTags ? 'Show less' : 'See all'}
                    </button>
                  )}
                </div>
                <div className={`flex flex-wrap gap-2 ${!showAllTags ? 'max-h-[12rem] overflow-y-auto' : ''}`}>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => onTagToggle(tag)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                        selectedTags.includes(tag)
                          ? 'bg-techstars-phosphor text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <DrawerFooter className="mt-6">
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    );
  }

  // For desktop, show a floating bar
  return (
    <div className="fixed bottom-[60px] left-1/2 transform -translate-x-1/2 z-50 w-auto max-w-3xl">
      <div className="bg-white rounded-full shadow-lg px-6 py-3 flex items-center gap-4 border border-gray-100">
        {/* Date Filter Button */}
        {availableDates.length > 0 && (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full">
                <Calendar size={16} className="mr-2" />
                {selectedDate ? selectedDate : 'Filter by date'}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filter by date</DrawerTitle>
                <DrawerDescription>
                  Filter mentors by their available dates
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 py-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => onDateSelect(date)}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                      selectedDate === date
                        ? 'bg-techstars-phosphor text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {date}
                  </button>
                ))}
              </div>
              <DrawerFooter>
                <Button variant="outline" onClick={() => onDateSelect(null)}>
                  Clear date
                </Button>
                <DrawerClose asChild>
                  <Button>Done</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}

        {/* Tags Filter Button */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full">
              <Filter size={16} className="mr-2" />
              Filter by company
              {selectedTags.length > 0 && (
                <span className="ml-2 bg-techstars-phosphor text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                  {selectedTags.length}
                </span>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Filter by company</DrawerTitle>
              <DrawerDescription>
                Select a company to filter founders
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <div className="flex flex-wrap gap-2 max-h-[40vh] overflow-y-auto p-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagToggle(tag)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-techstars-phosphor text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <DrawerFooter>
              <Button variant="outline" onClick={onClearFilters}>
                Clear all filters
              </Button>
              <DrawerClose asChild>
                <Button>Done</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* Clear Filters Button - only show if filters are active */}
        {hasActiveFilters && (
          <Button 
            onClick={onClearFilters}
            variant="ghost" 
            size="sm"
            className="text-techstars-slate hover:text-techstars-phosphor"
          >
            <X size={16} className="mr-2" />
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
};

export default FloatingFilterBar;

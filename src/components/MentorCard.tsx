import { Link } from 'react-router-dom';
import { Mentor } from '../types/mentor';
import { Linkedin, Mail } from 'lucide-react';
import { useMemo } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface MentorCardProps {
  mentor: Mentor;
  index: number;
}

// Fun placeholder images for mentors without headshots
const placeholderImages = [
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&fit=crop", // robot
  "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600&fit=crop", // cat
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&fit=crop", // deer
  "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=600&fit=crop", // kitten
];

// Maximum length for role and company display
const MAX_ROLE_LENGTH = 60;

const MentorCard: React.FC<MentorCardProps> = ({ mentor, index }) => {
  // Staggered animation delay based on index
  const animationDelay = `${index * 0.05}s`;

  // Generate a deterministic random placeholder based on the mentor's name
  const placeholderImage = useMemo(() => {
    if (mentor.headshot && mentor.headshot !== '/placeholder.svg') {
      return mentor.headshot;
    }
    
    // Use the mentor's name to generate a consistent index for the placeholder
    const nameSum = mentor.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const placeholderIndex = nameSum % placeholderImages.length;
    return placeholderImages[placeholderIndex];
  }, [mentor.name, mentor.headshot]);

  // Format role and company with character limit
  const formattedRoleAndCompany = useMemo(() => {
    if (!mentor.role && !mentor.company) return '';
    
    const roleAndCompany = mentor.role && mentor.company 
      ? `${mentor.role} at ${mentor.company}`
      : mentor.role || mentor.company || '';
    
    if (roleAndCompany.length <= MAX_ROLE_LENGTH) {
      return roleAndCompany;
    }
    
    return `${roleAndCompany.substring(0, MAX_ROLE_LENGTH)}...`;
  }, [mentor.role, mentor.company]);

  // Check if we need to show the full text in a tooltip
  const needsTooltip = useMemo(() => {
    if (!mentor.role && !mentor.company) return false;
    
    const roleAndCompany = mentor.role && mentor.company 
      ? `${mentor.role} at ${mentor.company}`
      : mentor.role || mentor.company || '';
      
    return roleAndCompany.length > MAX_ROLE_LENGTH;
  }, [mentor.role, mentor.company]);

  return (
    <Link 
      to={`/mentor/${mentor.slug}`}
      className="block"
    >
      <div 
        className="glass card-hover overflow-hidden relative rounded-xl border border-gray-100 shadow-sm"
        style={{ 
          animationDelay, 
          animation: 'scale-in 0.5s ease-out forwards',
          opacity: 1,
          transform: 'scale(1)',
          visibility: 'visible'
        }}
      >
        <div className="aspect-[3/4] overflow-hidden">
          <img 
            src={placeholderImage} 
            alt={mentor.name} 
            className="mentor-image w-full h-full object-cover"
            loading="lazy"
          />
          {!mentor.headshot || mentor.headshot === '/placeholder.svg' ? (
            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              May Look Different
            </div>
          ) : null}
        </div>
        
        <div className="p-4 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white">
          <div className="flex justify-between items-end">
            <div className="space-y-1 pr-16">
              <h3 className="text-lg font-medium">{mentor.name}</h3>
              {(mentor.role || mentor.company) && (
                needsTooltip ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-sm text-white/90 cursor-help">{formattedRoleAndCompany}</p>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs bg-black text-white border-gray-800">
                        <p>{mentor.role && mentor.company ? `${mentor.role} at ${mentor.company}` : mentor.role || mentor.company}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <p className="text-sm text-white/90">{formattedRoleAndCompany}</p>
                )
              )}
              <div className="flex flex-wrap gap-1 mt-2">
                {mentor.lookbookTag && mentor.lookbookTag.map((tag, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-0.5 bg-white/20 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="absolute bottom-4 right-4 grid grid-cols-2 gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href={mentor.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Linkedin size={16} className="text-white" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="bg-black text-white border-gray-800">
                    <p>View LinkedIn Profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-1.5 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors duration-200">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="text-white"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="bg-black text-white border-gray-800">
                    <p>View Full Profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {mentor.email && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a 
                        href={`mailto:${mentor.email}`}
                        className="p-1.5 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors duration-200 flex items-center justify-center w-[32px] h-[32px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail size={16} className="text-white" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="bg-black text-white border-gray-800">
                      <p>Email Directly</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `mailto:georgie@techstars.com?subject=Request%20Intro%20-%20${mentor.name}&body=Hi%20Georgie%2C%0A%0AI%20would%20like%20to%20request%20an%20introduction%20to%20${mentor.name}.%0A%0AThanks!`;
                      }}
                      className="p-1.5 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors duration-200 flex items-center justify-center w-[32px] h-[32px]"
                    >
                      <span className="text-white text-xs font-medium">RI</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="bg-black text-white border-gray-800">
                    <p>Request Introduction</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MentorCard;

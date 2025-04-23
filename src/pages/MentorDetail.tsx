import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMentorBySlug } from '../services/airtableService';
import { Mentor } from '../types/mentor';
import Navbar from '../components/Navbar';
import AnimatedPageTransition from '../components/AnimatedPageTransition';
import MentorFeedback from '../components/MentorFeedback';
import { ArrowLeft, Linkedin, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

// Fun placeholder images for mentors without headshots
const placeholderImages = [
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&fit=crop", // robot
  "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&fit=crop", // cat
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&fit=crop", // deer
  "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=800&fit=crop", // kitten
];

// Maximum length for role display in title
const MAX_ROLE_LENGTH = 80;

const MentorDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMentor = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const data = await fetchMentorBySlug(slug);
        setMentor(data);
        if (!data) {
          setError('Mentor not found');
        }
      } catch (err) {
        setError('Failed to load mentor details. Please try again later.');
        console.error('Error loading mentor:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMentor();
  }, [slug]);
  
  // Generate a deterministic random placeholder based on the mentor's name
  const mentorImage = useMemo(() => {
    if (!mentor) return placeholderImages[0];
    
    if (mentor.headshot && mentor.headshot !== '/placeholder.svg') {
      return mentor.headshot;
    }
    
    // Use the mentor's name to generate a consistent index for the placeholder
    const nameSum = mentor.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const placeholderIndex = nameSum % placeholderImages.length;
    return placeholderImages[placeholderIndex];
  }, [mentor]);

  // Format role and company with character limit
  const formattedRoleAndCompany = useMemo(() => {
    if (!mentor || (!mentor.role && !mentor.company)) return '';
    
    const roleAndCompany = mentor.role && mentor.company 
      ? `${mentor.role} at ${mentor.company}`
      : mentor.role || mentor.company || '';
    
    if (roleAndCompany.length <= MAX_ROLE_LENGTH) {
      return roleAndCompany;
    }
    
    return `${roleAndCompany.substring(0, MAX_ROLE_LENGTH)}...`;
  }, [mentor]);

  return (
    <AnimatedPageTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navbar />
        
        <main className="max-w-5xl mx-auto px-6 md:px-12 pb-20 mt-24">
          <Link 
            to="/" 
            className="inline-flex items-center py-2 px-4 mb-8 text-sm hover:text-techstars-phosphor transition-colors duration-300"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to all mentors
          </Link>

          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-techstars-phosphor rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-20">{error}</div>
          ) : mentor ? (
            <div className="grid md:grid-cols-[1fr,2fr] gap-8 animate-fade-in">
              <div className="space-y-6">
                <div className="overflow-hidden rounded-xl shadow-lg relative">
                  <img 
                    src={mentorImage} 
                    alt={mentor.name} 
                    className="mentor-image w-full aspect-square object-cover"
                  />
                  {(!mentor.headshot || mentor.headshot === '/placeholder.svg') && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                      May Look Different
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-4">
                  {mentor.phoneNumber && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white shadow-sm">
                      <div className="p-2 bg-techstars-phosphor/10 rounded-md text-techstars-phosphor">
                        <Phone size={20} />
                      </div>
                      <span>{mentor.phoneNumber}</span>
                    </div>
                  )}
                  <a 
                    href={mentor.linkedinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-white shadow-sm hover:shadow transition-shadow duration-300"
                  >
                    <div className="p-2 bg-[#0077B5]/10 rounded-md text-[#0077B5]">
                      <Linkedin size={20} />
                    </div>
                    <span>LinkedIn Profile</span>
                  </a>
                  
                  {mentor.email && (
                    <a 
                      href={`mailto:${mentor.email}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white shadow-sm hover:shadow transition-shadow duration-300"
                    >
                      <div className="p-2 bg-techstars-phosphor/10 rounded-md text-techstars-phosphor">
                        <Mail size={20} />
                      </div>
                      <span>Email Directly</span>
                    </a>
                  )}

                  {mentor.lookbookLabel === 'AM' && (
                    <a 
                      href={`mailto:georgie.smithwick@techstars.com,eoghan.oflaherty@techstars.com?subject=${encodeURIComponent(`Introduction to ${mentor.name} for a Techstars founder`)}&body=${encodeURIComponent(`Hi Georgie and Eoghan,

I hope this email finds you well. I'm writing to request an introduction to ${mentor.name}${mentor.role ? ` (${mentor.role}${mentor.company ? ` at ${mentor.company}` : ''})` : ''}.

Thank you for your help!

Best regards,
[Your name]`)}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white shadow-sm hover:shadow transition-shadow duration-300"
                    >
                      <div className="p-2 bg-green-500/10 rounded-md text-green-600">
                        <Mail size={20} />
                      </div>
                      <span>Request Introduction</span>
                    </a>
                  )}
                </div>
              </div>
              
              <div className="space-y-8">
                <div>
                  <div className="inline-block px-3 py-1 text-xs rounded-full bg-techstars-phosphor/10 text-techstars-phosphor font-medium mb-2">
                    Techstars Mentor
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{mentor.name}</h1>
                  {(mentor.role || mentor.company) && (
                    <div>
                      <p className="text-techstars-slate text-lg leading-relaxed">
                        {formattedRoleAndCompany}
                      </p>
                      {mentor.role && mentor.role.length > MAX_ROLE_LENGTH && (
                        <details className="mt-1">
                          <summary className="text-xs text-techstars-slate cursor-pointer hover:text-techstars-phosphor">
                            View full role details
                          </summary>
                          <p className="mt-2 text-sm text-techstars-slate bg-gray-50 p-3 rounded-md">
                            {mentor.role}
                            {mentor.company && ` at ${mentor.company}`}
                          </p>
                        </details>
                      )}
                    </div>
                  )}
                </div>
                
                {mentor.bio && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Bio</h2>
                    <p className="text-gray-700 leading-relaxed">{mentor.bio}</p>
                  </div>
                )}
                
                {mentor.expertise && mentor.expertise.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Areas of Expertise</h2>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {mentor.lookbookLabel === 'MM' && (
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-3">Feedback</h2>
                    <MentorFeedback mentorId={mentor.id} mentorName={mentor.name} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-techstars-slate py-20">Mentor not found</div>
          )}
        </main>
        
        <footer className="py-8 border-t border-gray-100 text-center text-sm text-techstars-slate">
          <div className="max-w-7xl mx-auto px-6">
            <p>© {new Date().getFullYear()} Techstars London. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </AnimatedPageTransition>
  );
};

export default MentorDetail;

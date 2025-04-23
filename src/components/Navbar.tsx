import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isMentorPage = location.pathname === '/' || 
                      location.pathname === '/additional-mentors' || 
                      location.pathname.startsWith('/mentor/');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`z-50 bg-white/80 backdrop-blur-sm shadow-sm py-6 px-6 md:px-12 transition-all duration-300 ${
      isScrolled ? 'fixed top-0 left-0 right-0' : 'relative'
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-2xl font-bold tracking-tight animate-fade-in"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-techstars-black rounded-md">
            <span className="text-techstars-white">TS</span>
          </div>
          <span>Techstars London</span>
        </Link>
        
        {isMentorPage && (
          <div className="flex gap-4">
            <Link 
              to="/"
              className={`text-sm animate-fade-in transition-colors duration-300 ${
                location.pathname === '/'
                  ? 'text-techstars-phosphor border-techstars-phosphor/30'
                  : 'text-techstars-slate border-techstars-slate/30 hover:text-techstars-phosphor hover:border-techstars-phosphor/30'
              }`}
            >
              <div className="px-3 py-1 rounded-full border">
                Mentor Magic
              </div>
            </Link>
            <Link 
              to="/additional-mentors"
              className={`text-sm animate-fade-in transition-colors duration-300 ${
                location.pathname === '/additional-mentors'
                  ? 'text-techstars-phosphor border-techstars-phosphor/30'
                  : 'text-techstars-slate border-techstars-slate/30 hover:text-techstars-phosphor hover:border-techstars-phosphor/30'
              }`}
            >
              <div className="px-3 py-1 rounded-full border">
                Additional Mentors
              </div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

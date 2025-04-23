import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const isCompaniesPage = location.pathname === '/companies';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
        <div className="text-sm text-techstars-slate">
          © {new Date().getFullYear()} Techstars London
        </div>
        
        <div>
          {isCompaniesPage ? (
            <Link 
              to="/"
              className="text-sm text-techstars-slate hover:text-techstars-phosphor transition-colors duration-300"
            >
              Go to mentors
            </Link>
          ) : (
            <Link 
              to="/companies"
              className="text-sm text-techstars-slate hover:text-techstars-phosphor transition-colors duration-300"
            >
              Go to cohort
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav; 
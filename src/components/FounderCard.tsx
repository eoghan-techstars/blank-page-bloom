import { Link } from 'react-router-dom';
import { Founder } from '../types/founder';
import { Linkedin, Mail, Phone } from 'lucide-react';

interface FounderCardProps {
  founder: Founder;
}

const FounderCard = ({ founder }: FounderCardProps) => {
  return (
    <Link
      to={`/founders/${founder.slug}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      <div className="aspect-square overflow-hidden relative">
        <img
          src={founder.headshot || '/placeholder.svg'}
          alt={founder.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {founder.company && (
          <div className="absolute top-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white px-4 py-2 text-sm font-medium">
            {founder.company}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-xl font-semibold mb-2">
              {founder.name}
            </h2>
            
            {(founder.role || founder.company) && (
              <p className="text-sm text-gray-200 mb-4">
                {founder.role && founder.company
                  ? `${founder.role} at ${founder.company}`
                  : founder.role || founder.company}
              </p>
            )}

            <div className="flex gap-4">
              {founder.linkedinUrl && (
                <a
                  href={founder.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-techstars-phosphor transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Linkedin size={20} />
                </a>
              )}
              {founder.email && (
                <a
                  href={`mailto:${founder.email}`}
                  className="text-white hover:text-techstars-phosphor transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Mail size={20} />
                </a>
              )}
              {founder.phoneNumber && (
                <a
                  href={`tel:${founder.phoneNumber}`}
                  className="text-white hover:text-techstars-phosphor transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Phone size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FounderCard; 
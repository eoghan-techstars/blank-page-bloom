import { Founder } from '../types/founder';
import { Phone, Mail, Linkedin, Edit, Save } from 'lucide-react';
import { useState } from 'react';
import { updateFounderOnboardingField } from '../services/founderAirtableService';

interface FoundersListProps {
  founders: Founder[];
}

const MAX_ROLE_LENGTH = 80;

const FoundersList = ({ founders }: FoundersListProps) => {
  const [editingFounderId, setEditingFounderId] = useState<string | null>(null);
  const [editingBio, setEditingBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Format role and company with character limit
  const getFormattedRoleAndCompany = (founder: Founder) => {
    if (!founder.role && !founder.company) return '';
    
    const roleAndCompany = founder.role && founder.company 
      ? `${founder.role} at ${founder.company}`
      : founder.role || founder.company || '';
    
    if (roleAndCompany.length <= MAX_ROLE_LENGTH) {
      return roleAndCompany;
    }
    
    return `${roleAndCompany.substring(0, MAX_ROLE_LENGTH)}...`;
  };

  const handleEdit = (founder: Founder) => {
    setEditingFounderId(founder.id);
    setEditingBio(founder.lookbookBio || '');
  };

  const handleSave = async (founder: Founder) => {
    setIsSaving(true);
    try {
      await updateFounderOnboardingField(founder.name, 'lookbookBio', editingBio);
      // Update the founder object in the parent component
      founder.lookbookBio = editingBio;
      setEditingFounderId(null);
    } catch (error) {
      console.error('Failed to save lookbook bio:', error);
      // You might want to add error handling UI here
    } finally {
      setIsSaving(false);
    }
  };

  if (!founders.length) {
    return null;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Founders</h2>
      {founders.map((founder) => (
        <div key={founder.id} className="bg-white rounded-xl shadow-sm p-8">
          <div className="grid md:grid-cols-[1fr,2fr] gap-8">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-xl shadow-lg relative">
                <img 
                  src={founder.headshot || '/placeholder.svg'} 
                  alt={founder.name} 
                  className="w-full aspect-square object-cover"
                />
                {(!founder.headshot || founder.headshot === '/placeholder.svg') && (
                  <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                    May Look Different
                  </div>
                )}
              </div>
              
              <div className="flex flex-col space-y-4">
                {founder.phoneNumber && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="p-2 bg-techstars-phosphor/10 rounded-md text-techstars-phosphor">
                      <Phone size={20} />
                    </div>
                    <span>{founder.phoneNumber}</span>
                  </div>
                )}
                <a 
                  href={founder.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                >
                  <div className="p-2 bg-[#0077B5]/10 rounded-md text-[#0077B5]">
                    <Linkedin size={20} />
                  </div>
                  <span>LinkedIn Profile</span>
                </a>
                
                {founder.email && (
                  <a 
                    href={`mailto:${founder.email}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                  >
                    <div className="p-2 bg-techstars-phosphor/10 rounded-md text-techstars-phosphor">
                      <Mail size={20} />
                    </div>
                    <span>Email Directly</span>
                  </a>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="inline-block px-3 py-1 text-xs rounded-full bg-techstars-phosphor/10 text-techstars-phosphor font-medium mb-2">
                  Techstars Founder
                </div>
                <h3 className="text-2xl font-bold mb-2">{founder.name}</h3>
                {(founder.role || founder.company) && (
                  <p className="text-techstars-slate text-lg">{getFormattedRoleAndCompany(founder)}</p>
                )}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    {editingFounderId === founder.id ? (
                      <button
                        onClick={() => handleSave(founder)}
                        disabled={isSaving}
                        className={`flex items-center gap-2 text-white bg-techstars-phosphor hover:bg-techstars-phosphor-dark transition-colors px-4 py-2 rounded-md ${
                          isSaving ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Save size={16} />
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(founder)}
                        className="text-techstars-phosphor hover:text-techstars-phosphor-dark transition-colors flex items-center gap-2"
                      >
                        <Edit size={16} />
                        Edit Bio
                      </button>
                    )}
                  </div>
                  {editingFounderId === founder.id ? (
                    <textarea
                      value={editingBio}
                      onChange={(e) => setEditingBio(e.target.value)}
                      className="w-full p-4 border rounded-md focus:ring-2 focus:ring-techstars-phosphor focus:border-transparent min-h-[200px]"
                      placeholder="Write your lookbook bio here..."
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {founder.lookbookBio || 'No lookbook bio available.'}
                    </p>
                  )}
                </div>
              </div>
              
              {founder.bio && (
                <div>
                  <h4 className="text-xl font-semibold mb-3">About the Founder</h4>
                  <p className="text-gray-700 leading-relaxed">{founder.bio}</p>
                </div>
              )}
              
              {founder.expertise && founder.expertise.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold mb-3">Areas of Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {founder.expertise.map((skill, index) => (
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
              
              {founder.industries && founder.industries.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold mb-3">Industries of Interest</h4>
                  <div className="flex flex-wrap gap-2">
                    {founder.industries.map((industry, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoundersList; 
import React from 'react';

interface TeamProps {
  settings: {
    title: string;
    subtitle?: string;
    members: Array<{
      name: string;
      role: string;
      image: string;
      bio?: string;
    }>;
  };
}

export const TeamSection: React.FC<TeamProps> = ({ settings }) => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{settings.title}</h2>
          {settings.subtitle && <p className="text-gray-500 max-w-2xl mx-auto">{settings.subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {settings.members?.map((member, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gray-100">
                <img src={member.image || 'https://via.placeholder.com/150'} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
              <p className="text-indigo-600 font-medium text-sm mb-3">{member.role}</p>
              {member.bio && <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
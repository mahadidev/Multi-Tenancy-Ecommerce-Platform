import React from 'react';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

interface TeamSectionProps {
  title?: string;
  subtitle?: string;
  members?: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({
  title = 'Meet Our Team',
  subtitle = 'The people behind our success',
  members = []
}) => {
  // Default team members if none provided
  const defaultMembers: TeamMember[] = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://placehold.co/400x400/1e40af/ffffff?text=SJ',
      bio: 'Passionate about creating amazing shopping experiences.'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Operations',
      image: 'https://placehold.co/400x400/1e40af/ffffff?text=MC',
      bio: 'Ensuring smooth operations and customer satisfaction.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Lead Designer',
      image: 'https://placehold.co/400x400/1e40af/ffffff?text=ER',
      bio: 'Creating beautiful and functional designs.'
    },
    {
      name: 'David Kim',
      role: 'Customer Success',
      image: 'https://placehold.co/400x400/1e40af/ffffff?text=DK',
      bio: 'Dedicated to helping our customers succeed.'
    }
  ];

  const teamMembers = members.length > 0 ? members : defaultMembers;

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {subtitle && (
            <p className="text-blue-600 font-medium mb-2 uppercase tracking-wide text-sm">
              {subtitle}
            </p>
          )}
          <h2 className="text-3xl lg:text-4xl font-bold">
            {title}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <div className="mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
              <p className="text-blue-600 text-sm mb-2">{member.role}</p>
              {member.bio && (
                <p className="text-gray-600 text-sm">{member.bio}</p>
              )}
              {member.social && (
                <div className="flex justify-center gap-3 mt-3">
                  {member.social.twitter && (
                    <a 
                      href={member.social.twitter}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="Twitter"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                      </svg>
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a 
                      href={member.social.linkedin}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"></path>
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
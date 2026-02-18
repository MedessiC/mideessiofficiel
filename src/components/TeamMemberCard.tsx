import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { TeamMember } from '../data/teamMembers';

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  return (
    <Link to={`/team/${member.id}`}>
      <div className="group h-full flex flex-col items-center text-center">
        {/* Avatar Circular Container */}
        <div className="relative mb-6 w-32 h-32 md:w-40 md:h-40">
          {/* Background circle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold via-yellow-500 to-gold rounded-full opacity-0 group-hover:opacity-20 transition-all duration-500 blur-xl"></div>
          
          {/* Main circular image */}
          <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-900 shadow-xl group-hover:shadow-2xl group-hover:shadow-gold/20 transition-all duration-500 transform group-hover:scale-105">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/400x400?text=' + encodeURIComponent(member.name);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Role circle badge */}
          <div className="absolute -bottom-2 -right-2 bg-gold text-midnight px-4 py-2 rounded-full shadow-lg text-xs font-bold whitespace-nowrap transform group-hover:scale-110 transition-transform duration-300">
            {member.role.split(' &')[0]}
          </div>
        </div>

        {/* Content Container */}
        <div className="w-full">
          {/* Name and Role */}
          <h3 className="text-xl md:text-2xl font-bold text-midnight dark:text-white mb-1 group-hover:text-gold transition-colors duration-300">
            {member.name}
          </h3>
          <p className="text-gold font-bold text-sm md:text-base mb-4">{member.role}</p>

          {/* Social status pill */}
          <div className="inline-block bg-gold/10 backdrop-blur-sm border border-gold/30 rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200">
              Depuis <span className="text-gold font-bold">{member.joinDate}</span>
            </span>
          </div>

          {/* Short Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5 px-2 line-clamp-3">
            {member.shortDescription}
          </p>

          {/* Skills Preview - Minimal Style */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-6">
            {member.skills.slice(0, 2).map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-gradient-to-r from-gold/10 to-gold/5 text-gold text-xs font-semibold rounded-full border border-gold/20 backdrop-blur-sm group-hover:border-gold/50 transition-all duration-300"
              >
                {skill}
              </span>
            ))}
            {member.skills.length > 2 && (
              <span className="px-2.5 py-1 bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20 backdrop-blur-sm">
                +{member.skills.length - 2}
              </span>
            )}
          </div>

          {/* CTA Button */}
          <div className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-midnight dark:bg-white text-white dark:text-midnight font-semibold text-sm rounded-full hover:gap-3 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-gold/20">
            <span>Découvrir</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TeamMemberCard;

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Briefcase, Heart, Code, Link as LinkIcon } from 'lucide-react';
import { teamMembers } from '../data/teamMembers';

const TeamMemberProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const member = teamMembers.find(m => m.id === id);

  if (!member) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-midnight dark:text-white mb-4">Membre non trouvé</h1>
          <button
            onClick={() => navigate('/about')}
            className="text-gold hover:text-gold/80 font-semibold flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Retourner à la page À propos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate('/about')}
          className="flex items-center gap-2 text-gold hover:text-gold/80 font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retourner à la page À propos
        </button>
      </div>

      {/* Header Section */}
      <section className="border-b border-gray-200 dark:border-gray-800 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Image */}
            <div className="flex justify-center md:justify-start">
              <div className="relative group">
                <div className="relative w-80 h-96 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-gold/30">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x500?text=' + encodeURIComponent(member.name);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/30 to-transparent"></div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold rounded-full flex items-center justify-center shadow-xl">
                  <Briefcase className="w-12 h-12 text-midnight" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-midnight dark:text-white mb-2">
                  {member.name}
                </h1>
                <p className="text-2xl text-gold font-bold mb-4">{member.role}</p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <MapPin className="w-5 h-5 text-gold flex-shrink-0" />
                    <span className="text-lg">{member.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Briefcase className="w-5 h-5 text-gold flex-shrink-0" />
                    <span className="text-lg">Membre depuis {member.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Code className="w-5 h-5 text-gold flex-shrink-0" />
                    <span className="text-lg">{member.education}</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              {member.email && (
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-gold font-semibold mb-2">
                    <Mail className="w-4 h-4" />
                    Contact
                  </div>
                  <a href={`mailto:${member.email}`} className="text-midnight dark:text-white hover:text-gold font-semibold">
                    {member.email}
                  </a>
                </div>
              )}

              {/* Social Links */}
              <div className="flex gap-3">
                {member.socialLinks.linkedin && (
                  <a
                    href={member.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gold text-midnight px-4 py-2 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {member.socialLinks.github && (
                  <a
                    href={member.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-midnight dark:bg-white text-white dark:text-midnight px-4 py-2 rounded-lg font-semibold hover:opacity-80 transition-opacity"
                  >
                    <LinkIcon className="w-4 h-4" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-midnight dark:text-white mb-6">À propos</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {member.fullBio}
            </p>
          </div>

          {/* Skills Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-midnight dark:text-white mb-6">Compétences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main Skills */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-midnight dark:text-white mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-gold" />
                  Compétences techniques
                </h3>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gold/10 text-gold font-semibold rounded-full border border-gold/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-midnight dark:text-white mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gold" />
                  Spécialités
                </h3>
                <div className="flex flex-wrap gap-2">
                  {member.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 font-semibold rounded-full border border-green-500/20"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Passions Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-midnight dark:text-white mb-6 flex items-center gap-2">
              <Heart className="w-8 h-8 text-red-500" />
              Passions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {member.passions.map((passion, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-lg border border-red-500/20"
                >
                  <p className="text-red-600 dark:text-red-400 font-semibold">{passion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div>
            <h2 className="text-3xl font-bold text-midnight dark:text-white mb-6">Projets & Contributions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {member.projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                  <h3 className="text-lg font-bold text-midnight dark:text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-gold font-semibold hover:text-gold/80 transition-colors"
                    >
                      Voir le projet <LinkIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Members */}
      <section className="border-t border-gray-200 dark:border-gray-800 py-12 md:py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-midnight dark:text-white mb-8">Autres membres de l'équipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {teamMembers
              .filter(m => m.id !== id)
              .map(m => (
                <button
                  key={m.id}
                  onClick={() => navigate(`/team/${m.id}`)}
                  className="text-left group bg-gray-50 dark:bg-gray-900 rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 border border-transparent hover:border-gold"
                >
                  <div className="flex gap-4 items-start">
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <img
                        src={m.image}
                        alt={m.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/100x100?text=' + encodeURIComponent(m.name);
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-midnight dark:text-white mb-1 group-hover:text-gold transition-colors">
                        {m.name}
                      </h3>
                      <p className="text-gold font-semibold text-sm mb-2">{m.role}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                        {m.shortDescription}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamMemberProfile;

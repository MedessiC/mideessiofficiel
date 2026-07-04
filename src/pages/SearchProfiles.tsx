import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Search, Users, BookOpen, Award, X, Loader2, Lock, Star } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import SEO from '../components/SEO';

interface PublicProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  is_library_public: boolean;
  quiz_score?: number;
  books_read?: number;
}

export default function SearchProfiles() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PublicProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchProfiles(query.trim());
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const searchProfiles = async (q: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await supabase
        .from('users')
        .select('id, username, avatar_url, bio, location, is_library_public')
        .ilike('username', `%${q}%`)
        .limit(20);

      if (!data) { setResults([]); return; }

      // Enrichir avec le score de quiz et les livres lus (pour profils publics)
      const enriched = await Promise.all(
        data.map(async (profile: any) => {
          let quizScore = 0;
          let booksRead = 0;

          // Quiz score (toujours visible)
          const { data: attempts } = await supabase
            .from('user_quiz_attempts')
            .select('score, total_questions')
            .eq('user_id', profile.id);

          if (attempts) {
            let correct = 0;
            let total = 0;
            attempts.forEach((a: any) => { correct += Number(a.score || 0); total += Number(a.total_questions || 0); });
            quizScore = total > 0 ? Math.round((correct / total) * 100) : 0;
          }

          // Livres lus seulement si profil public
          if (profile.is_library_public) {
            const { count } = await supabase
              .from('book_progress')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', profile.id)
              .gte('progress_percent', 10); // au moins 10% de lecture
            booksRead = count || 0;
          }

          return { ...profile, quiz_score: quizScore, books_read: booksRead };
        })
      );

      setResults(enriched);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] pt-24 pb-20 px-4">
      <SEO
        title="Rechercher un profil – MIDEESSI"
        description="Trouvez un lecteur par son nom de profil MIDEESSI, consultez ses livres lus et son score académique."
      />

      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-[var(--brand-midnight)]/10 dark:bg-[var(--brand-gold)]/10 text-[var(--brand-midnight)] dark:text-[var(--brand-gold)] rounded-full px-4 py-1.5 text-xs font-bold tracking-wider uppercase mb-4">
          <Users className="w-3.5 h-3.5" /> Communauté
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[var(--brand-midnight)] dark:text-white mb-3">
          Rechercher un profil
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
          Retrouvez n'importe quel lecteur MIDEESSI par son nom de profil et consultez son parcours académique.
        </p>
      </div>

      {/* Search bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            id="profile-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par nom de profil..."
            className="w-full pl-12 pr-12 py-4 rounded-2xl border border-[var(--border)] bg-white dark:bg-gray-900 text-[var(--brand-midnight)] dark:text-white placeholder-gray-400 outline-none focus:border-[var(--brand-gold)] shadow-sm text-sm font-medium transition-all"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {query.trim().length === 1 && (
          <p className="text-xs text-gray-400 mt-2 ml-1">Tapez au moins 2 caractères pour lancer la recherche.</p>
        )}
      </div>

      {/* Results */}
      <div className="max-w-2xl mx-auto">
        {loading && (
          <div className="flex items-center justify-center gap-3 py-16 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Recherche en cours...</span>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="font-bold text-[var(--brand-midnight)] dark:text-white mb-1.5">Aucun profil trouvé</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Aucun utilisateur avec le pseudonyme "<strong>{query}</strong>" n'a été trouvé.
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 mb-4 ml-1">{results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}</p>
            {results.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}

        {!searched && !loading && (
          <div className="text-center py-16 opacity-60">
            <div className="w-16 h-16 bg-gradient-to-br from-[var(--brand-midnight)] to-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Search className="w-7 h-7 text-[var(--brand-gold)]" />
            </div>
            <p className="text-sm text-gray-400">Commencez à taper pour trouver un lecteur.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileCard({ profile }: { profile: PublicProfile }) {
  return (
    <Link
      to={`/profile/${profile.username}`}
      className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl shadow-sm hover:border-[var(--brand-gold)]/50 hover:shadow-md transition-all group"
    >
      <Avatar
        src={profile.avatar_url || undefined}
        name={profile.username}
        className="w-12 h-12 rounded-full flex-shrink-0 ring-2 ring-transparent group-hover:ring-[var(--brand-gold)]/40 transition-all"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-black text-sm text-[var(--brand-midnight)] dark:text-white group-hover:text-[var(--brand-gold)] transition-colors">
              @{profile.username}
            </h3>
            {profile.location && (
              <p className="text-[10px] text-gray-400 mt-0.5">{profile.location}</p>
            )}
          </div>
          {/* Score badge */}
          <div className="flex-shrink-0 flex items-center gap-1.5 bg-[var(--brand-midnight)]/5 dark:bg-white/5 rounded-xl px-2.5 py-1">
            <Award className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
            <span className="text-xs font-black text-[var(--brand-midnight)] dark:text-white">{profile.quiz_score ?? 0}%</span>
          </div>
        </div>

        {profile.bio && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{profile.bio}</p>
        )}

        {/* Stats footer */}
        <div className="flex items-center gap-4 mt-2.5">
          {profile.is_library_public ? (
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <BookOpen className="w-3 h-3" />
              {profile.books_read ?? 0} livre{(profile.books_read ?? 0) > 1 ? 's' : ''} lu{(profile.books_read ?? 0) > 1 ? 's' : ''}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
              <Lock className="w-3 h-3" />
              Bibliothèque privée
            </span>
          )}
          <span className="flex items-center gap-1 text-[10px] text-[var(--brand-gold)] font-semibold">
            <Star className="w-3 h-3 fill-[var(--brand-gold)]" />
            Score Quiz : {profile.quiz_score ?? 0}%
          </span>
        </div>
      </div>
    </Link>
  );
}

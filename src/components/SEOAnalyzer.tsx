// components/SEOAnalyzer.tsx
import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, TrendingUp, Eye, Target } from 'lucide-react';
import { supabase, SEOAnalysis } from '../lib/supabase';

interface SEOAnalyzerProps {
  postId?: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  imageUrl: string;
}

const SEOAnalyzer = ({ postId, title, excerpt, content, tags, imageUrl }: SEOAnalyzerProps) => {
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [localScore, setLocalScore] = useState(0);

  useEffect(() => {
    // Analyse locale en temps réel
    calculateLocalScore();
    
    // Si l'article existe, charger l'analyse complète
    if (postId) {
      loadFullAnalysis();
    }
  }, [title, excerpt, content, tags, imageUrl, postId]);

  const calculateLocalScore = () => {
    let score = 0;

    // Titre (20 points)
    if (title.length >= 30 && title.length <= 60) score += 20;
    else if (title.length > 0) score += 10;

    // Description (20 points)
    if (excerpt.length >= 120 && excerpt.length <= 160) score += 20;
    else if (excerpt.length > 0) score += 10;

    // Contenu (20 points)
    const words = content.trim().split(/\s+/).length;
    if (words >= 500) score += 20;
    else if (words >= 300) score += 15;
    else if (words > 0) score += (words / 300) * 20;

    // Tags (20 points)
    const tagCount = tags.filter(t => t.trim()).length;
    if (tagCount >= 3) score += 20;
    else score += (tagCount / 3) * 20;

    // Image (20 points)
    if (imageUrl) score += 20;

    setLocalScore(Math.round(score));
  };

  const loadFullAnalysis = async () => {
    if (!postId) return;

    try {
      const { data, error } = await supabase.rpc('analyze_post_seo', {
        post_id_param: postId
      });

      if (error) throw error;
      setAnalysis(data);
    } catch (error) {
      console.error('Erreur analyse SEO:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const displayScore = analysis?.seo_score || localScore;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-corporate-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-midnight dark:text-white flex items-center gap-2">
          <Target className="w-5 h-5" />
          Analyse SEO
        </h3>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getScoreBgColor(displayScore)}`}>
          <TrendingUp className={`w-5 h-5 ${getScoreColor(displayScore)}`} />
          <span className={`text-2xl font-bold ${getScoreColor(displayScore)}`}>
            {displayScore}
          </span>
          <span className="text-sm text-corporate-500 dark:text-corporate-400">/100</span>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-corporate-50 dark:bg-gray-700 rounded-lg">
          <div className="text-xs text-corporate-500 dark:text-corporate-400 mb-1">Titre</div>
          <div className={`text-lg font-bold ${
            title.length >= 30 && title.length <= 60 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-yellow-600 dark:text-yellow-400'
          }`}>
            {title.length}/60
          </div>
        </div>

        <div className="p-3 bg-corporate-50 dark:bg-gray-700 rounded-lg">
          <div className="text-xs text-corporate-500 dark:text-corporate-400 mb-1">Description</div>
          <div className={`text-lg font-bold ${
            excerpt.length >= 120 && excerpt.length <= 160 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-yellow-600 dark:text-yellow-400'
          }`}>
            {excerpt.length}/160
          </div>
        </div>

        <div className="p-3 bg-corporate-50 dark:bg-gray-700 rounded-lg">
          <div className="text-xs text-corporate-500 dark:text-corporate-400 mb-1">Mots</div>
          <div className={`text-lg font-bold ${
            content.trim().split(/\s+/).length >= 300 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {content.trim().split(/\s+/).filter(Boolean).length}
          </div>
        </div>

        <div className="p-3 bg-corporate-50 dark:bg-gray-700 rounded-lg">
          <div className="text-xs text-corporate-500 dark:text-corporate-400 mb-1">Tags</div>
          <div className={`text-lg font-bold ${
            tags.filter(t => t.trim()).length >= 3 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-yellow-600 dark:text-yellow-400'
          }`}>
            {tags.filter(t => t.trim()).length}
          </div>
        </div>
      </div>

      {/* Analyse détaillée */}
      {analysis && (
        <div className="space-y-4">
          {/* Problèmes critiques */}
          {analysis.analysis.issues.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold mb-2">
                <AlertCircle className="w-4 h-4" />
                Problèmes à corriger ({analysis.analysis.issues.length})
              </div>
              <ul className="space-y-1 pl-6">
                {analysis.analysis.issues.map((issue, index) => (
                  <li key={index} className="text-sm text-corporate-600 dark:text-corporate-300 list-disc">
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Avertissements */}
          {analysis.analysis.warnings.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-semibold mb-2">
                <AlertTriangle className="w-4 h-4" />
                À améliorer ({analysis.analysis.warnings.length})
              </div>
              <ul className="space-y-1 pl-6">
                {analysis.analysis.warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-corporate-600 dark:text-corporate-300 list-disc">
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Points positifs */}
          {analysis.analysis.success.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold mb-2">
                <CheckCircle className="w-4 h-4" />
                Points forts ({analysis.analysis.success.length})
              </div>
              <ul className="space-y-1 pl-6">
                {analysis.analysis.success.map((success, index) => (
                  <li key={index} className="text-sm text-corporate-600 dark:text-corporate-300 list-disc">
                    {success}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommandations */}
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold mb-2">
              <Eye className="w-4 h-4" />
              Recommandations
            </div>
            <ul className="space-y-1 pl-6">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-corporate-600 dark:text-corporate-300 list-disc">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Guide rapide si pas d'analyse complète */}
      {!analysis && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            💡 Conseils SEO rapides
          </h4>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
            <li>✓ Titre: 30-60 caractères avec mot-clé principal</li>
            <li>✓ Description: 120-160 caractères engageante</li>
            <li>✓ Contenu: Minimum 300 mots (500+ idéal)</li>
            <li>✓ Tags: 3-5 tags pertinents</li>
            <li>✓ Image: 1200x630px pour partages sociaux</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SEOAnalyzer;
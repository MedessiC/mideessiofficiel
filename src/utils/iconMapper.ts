import {
  Smartphone,
  UtensilsCrossed,
  Leaf,
  Wallet,
  BookOpen,
  Sparkles,
  Users,
  Zap,
  TrendingDown,
  Lock,
  Link,
  MessageCircle,
  Calculator,
  MapPin,
  Star,
  LucideIcon,
  Filter,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Mail,
  Code,
  Award,
  TrendingUp,
  Eye,
  Share2
} from 'lucide-react';

type IconName = string;

export const getIcon = (iconName: IconName): React.FC<{ className?: string }> => {
  const icons: Record<string, LucideIcon> = {
    Smartphone,
    UtensilsCrossed,
    Leaf,
    Wallet,
    BookOpen,
    Sparkles,
    Users,
    Zap,
    TrendingDown,
    Lock,
    Link,
    MessageCircle,
    Calculator,
    MapPin,
    Star,
    Filter,
    CheckCircle,
    ExternalLink,
    ArrowRight,
    ArrowLeft,
    Mail,
    Code,
    Award,
    TrendingUp,
    Eye,
    Share2
  };

  return icons[iconName] || Sparkles;
};

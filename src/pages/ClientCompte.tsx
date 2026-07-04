import { useEffect, useState } from 'react';
import { useClientAuth } from '../contexts/ClientContext';
import { BottomSheet } from '../components/ui/BottomSheet';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

export default function ClientCompte() {
  const { user, signOut, completeOnboarding } = useClientAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [telephone, setTelephone] = useState(user?.telephone || '');
  const [entreprise, setEntreprise] = useState(user?.entreprise || '');

  useEffect(() => {
    setTelephone(user?.telephone || '');
    setEntreprise(user?.entreprise || '');
  }, [user]);

  const handleProfileSave = async () => {
    if (!user?.client_id) return;
    await supabase.from('clients').update({ telephone, entreprise }).eq('client_id', user.client_id);
    setProfileOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="space-y-6 pb-28">
      <SEO title="Compte | Client MIDEESSI" description="Gérez votre profil client et vos paramètres d’accès." />
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-gold)]/90">Compte</p>
        <h1 className="text-2xl font-semibold text-[var(--brand-midnight)]">Vos informations</h1>
        <p className="max-w-2xl text-sm text-[var(--text-secondary)]">Gérez votre profil, la sécurité de votre compte et vos coordonnées.</p>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-[24px] border border-[var(--border)] bg-[var(--bg-card)] p-6 text-center shadow-soft sm:flex-row sm:items-center sm:text-left">
        <Avatar name={user?.nom_marque || 'MIDEESSI'} size="lg" />
        <div className="flex-1">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-hint)]">Identité</p>
          <p className="mt-2 text-2xl font-semibold text-[var(--brand-midnight)]">{user?.nom_marque || 'Client MIDEESSI'}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <Badge label={`ID ${user?.client_id ?? '—'}`} variant="secondary" />
            <Badge label={user?.pack?.toUpperCase() || 'PACK'} variant="primary" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="space-y-3">
          <p className="text-sm uppercase tracking-[0.25em] text-[var(--text-hint)]">Informations</p>
          <div>
            <p className="text-xs text-[var(--text-secondary)]">Email</p>
            <p className="mt-1 text-sm text-[var(--brand-midnight)]">{user?.email || 'Non défini'}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)]">Téléphone</p>
            <p className="mt-1 text-sm text-[var(--brand-midnight)]">{telephone || 'Non défini'}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)]">Entreprise</p>
            <p className="mt-1 text-sm text-[var(--brand-midnight)]">{entreprise || 'Non défini'}</p>
          </div>
          <button type="button" onClick={() => setProfileOpen(true)} className="w-full rounded-[16px] bg-[var(--brand-midnight)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-midnight-dark)]">
            Modifier le profil
          </button>
        </Card>

        <Card className="space-y-3">
          <p className="text-sm uppercase tracking-[0.25em] text-[var(--text-hint)]">Sécurité</p>
          <div>
            <p className="text-sm text-[var(--brand-midnight)]">Changer le mot de passe</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Recommandé tous les 3 mois.</p>
          </div>
          <button type="button" onClick={() => setSecurityOpen(true)} className="w-full rounded-[16px] border border-[var(--brand-midnight)] px-4 py-3 text-sm font-semibold text-[var(--brand-midnight)] transition hover:bg-[var(--brand-midnight)]/10">
            Modifier le mot de passe
          </button>
        </Card>
      </div>

      <div className="rounded-[24px] border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[var(--text-hint)]">Déconnexion</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Sécurisez votre session après chaque utilisation.</p>
          </div>
          <button type="button" onClick={handleLogout} className="rounded-[16px] border border-[color:var(--danger-red)] px-5 py-3 text-sm font-semibold text-[color:var(--danger-red-strong)] transition hover:bg-[color:var(--danger-bg)]">
            Se déconnecter
          </button>
        </div>
      </div>

      <BottomSheet open={profileOpen} onClose={() => setProfileOpen(false)} title="Modifier le profil">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[var(--brand-midnight)]">Téléphone</label>
          <input value={telephone} onChange={(event) => setTelephone(event.target.value)} className="w-full rounded-[18px] border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/15" />
          <label className="block text-sm font-semibold text-[var(--brand-midnight)]">Entreprise</label>
          <input value={entreprise} onChange={(event) => setEntreprise(event.target.value)} className="w-full rounded-[18px] border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/15" />
          <button type="button" onClick={handleProfileSave} className="w-full rounded-[18px] bg-[var(--brand-midnight)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-midnight-dark)]">Enregistrer</button>
        </div>
      </BottomSheet>

      <BottomSheet open={securityOpen} onClose={() => setSecurityOpen(false)} title="Changer le mot de passe">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[var(--brand-midnight)]">Mot de passe actuel</label>
          <input type="password" placeholder="••••••••" className="w-full rounded-[18px] border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/15" />
          <label className="block text-sm font-semibold text-[var(--brand-midnight)]">Nouveau mot de passe</label>
          <input type="password" placeholder="••••••••" className="w-full rounded-[18px] border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/15" />
          <label className="block text-sm font-semibold text-[var(--brand-midnight)]">Confirmation</label>
          <input type="password" placeholder="••••••••" className="w-full rounded-[18px] border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-sm outline-none focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/15" />
          <div className="rounded-[20px] bg-[color:var(--surface-light)] p-4 text-sm text-[var(--text-secondary)]">
            8+ caractères • 1 majuscule • 1 chiffre
          </div>
          <button type="button" className="w-full rounded-[18px] bg-[var(--brand-midnight)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-midnight-dark)]">Enregistrer le mot de passe</button>
        </div>
      </BottomSheet>
    </div>
  );
}

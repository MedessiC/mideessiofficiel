import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock3, Lightbulb, Server, Globe, ArrowRight, Network, MonitorSmartphone } from 'lucide-react';

const FondamentauxWeb = () => {
  return (
    <div style={{ backgroundColor: '#FAFAFA' }} className="min-h-screen pb-16 pt-20 sm:pb-20 sm:pt-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-12">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link to="/apprendre/formations/developpement-web/parcours" className="inline-flex items-center gap-2 text-sm font-semibold text-[#191970]">
            <ArrowLeft size={16} /> Retour
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#191970]">
            <Clock3 size={12} /> 30 min
          </span>
        </div>

        <section
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
            border: '1px solid #E5E7EB',
            borderRadius: '28px',
            boxShadow: '0 18px 45px rgba(15, 23, 42, 0.04)',
          }}
          className="overflow-hidden p-5 sm:p-8 lg:p-10"
        >
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6B7280]">Bloc 1</p>
            <h1
              className="mt-3 font-bold"
              style={{
                fontSize: 'clamp(32px, 6vw, 64px)',
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
                color: '#111827',
              }}
            >
              Fondamentaux du Web
            </h1>
            <p
              className="mt-4 text-base sm:text-lg"
              style={{
                lineHeight: 1.8,
                color: '#4B5563',
                maxWidth: '720px',
              }}
            >
              Comprendre le monde dans lequel nous allons construire, puis apprendre à créer, à partager et à transformer le numérique avec des bases solides.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#374151]">
              Internet
            </span>
            <span className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#374151]">
              Site web
            </span>
            <span className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#374151]">
              Serveur
            </span>
            <span className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#374151]">
              App web
            </span>
          </div>
        </section>

        <div className="mt-8 space-y-8">
          <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF] text-[#191970]">
                <Lightbulb size={18} />
              </div>
              <h2 className="text-2xl font-bold text-[#111827] sm:text-3xl">1. Pourquoi cette formation ?</h2>
            </div>
            <p className="text-base leading-8 text-[#4B5563] sm:text-lg">
              Dans un monde dominé par le numérique, comprendre Internet, l’intelligence artificielle et la création d’applications n’est plus une option. C’est une compétence essentielle.
            </p>
            <p className="mt-4 text-base leading-8 text-[#4B5563] sm:text-lg">
              Qu’est-ce qu’Internet réellement ? C’est ce que les opérateurs mobiles vendent quand on achète un forfait internet. Et un site web, c’est quoi ? Quelle est la différence entre un site web et Internet ? Comment naissent WhatsApp, Facebook ou d’autres plateformes ?
            </p>
            <p className="mt-4 text-base leading-8 text-[#4B5563] sm:text-lg">
              Si vous n’avez pas de réponse claire à ces questions, alors vous avez bien compris l’importance de cette formation. Cette première étape permet de poser les bonnes bases avant de construire quoi que ce soit.
            </p>
          </section>

          <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF] text-[#191970]">
                <Network size={18} />
              </div>
              <h2 className="text-2xl font-bold text-[#111827] sm:text-3xl">2. Notre vision</h2>
            </div>
            <p className="text-base leading-8 text-[#4B5563] sm:text-lg">
              La technologie et le numérique font partie intégrante de notre vie. Comprendre son fonctionnement et l’utiliser pour réaliser des transformations durables n’est plus un choix en 2026 : c’est devenu une obligation.
            </p>
            <p className="mt-4 text-base leading-8 text-[#4B5563] sm:text-lg">
              Ce que nous voulons faire ici, c’est vous donner les clés pour comprendre le monde numérique pour mieux le maîtriser, le construire, puis le faire évoluer à votre manière.
            </p>
          </section>

          <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF] text-[#191970]">
                <MonitorSmartphone size={18} />
              </div>
              <h2 className="text-2xl font-bold text-[#111827] sm:text-3xl">3. C’est quoi un site web ?</h2>
            </div>
            <p className="text-base leading-8 text-[#4B5563] sm:text-lg">
              Un site web, de façon simple, c’est le regroupement de plusieurs pages web. Une page web est un document numérique qu’un navigateur comme Chrome, Opera ou Edge peut afficher. C’est un peu comme un fichier Word qu’on ouvre pour lire un exposé, ou un document PDF qu’on affiche sur un téléphone.
            </p>
            <p className="mt-4 text-base leading-8 text-[#4B5563] sm:text-lg">
              Donc une page web est une seule page. Un site web, c’est toutes les pages réunies, avec les liens qui les relient entre elles. C’est le livre, alors que la page web est une page de ce livre.
            </p>
            <p className="mt-4 text-base leading-8 text-[#4B5563] sm:text-lg">
              Sur le site web mideessi.com, une page web peut être par exemple <span className="font-semibold text-[#191970]">mideessi.com/contact</span> et le site web est l’ensemble de toutes les pages qui constituent le site.
            </p>
          </section>

          <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF] text-[#191970]">
                <Globe size={18} />
              </div>
              <h2 className="text-2xl font-bold text-[#111827] sm:text-3xl">4. Une page web, un site web, un but précis</h2>
            </div>
            <p className="text-base leading-8 text-[#4B5563] sm:text-lg">
              Sur un site, les liens qui connectent les pages sont appelés hyperliens. C’est la “colle” qui permet de passer d’une page à une autre.
            </p>
            <p className="mt-4 text-base leading-8 text-[#4B5563] sm:text-lg">
              Un site web a toujours un but précis : présenter une entreprise, une personne, un produit, vendre, communiquer, distraire, informer, partager ou enseigner. La forme du site dépend de ce but.
            </p>
            <p className="mt-4 text-base leading-8 text-[#4B5563] sm:text-lg">
              Une page web est donc une unité. Un site web est un ensemble cohérent de pages qui travaillent ensemble pour servir un objectif.
            </p>
          </section>

          <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF] text-[#191970]">
                <Server size={18} />
              </div>
              <h2 className="text-2xl font-bold text-[#111827] sm:text-3xl">5. C’est où un site web ?</h2>
            </div>
            <p className="text-base leading-8 text-[#4B5563] sm:text-lg">
              Il faut maintenant comprendre où un site web se retrouve concrètement. Le site web n’est pas “dans Internet” comme un objet directement visible. Il est stocké dans une infrastructure appelée serveur.
            </p>
            <p className="mt-4 text-base leading-8 text-[#4B5563] sm:text-lg">
              Donc, quand on dit “je suis sur un site web”, on dit en réalité que ton navigateur demande une page à un autre ordinateur connecté, qui est le serveur. Le serveur stocke les informations et les renvoie quand tu les demandes.
            </p>
          </section>

          <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF] text-[#191970]">
                <Server size={18} />
              </div>
              <h2 className="text-2xl font-bold text-[#111827] sm:text-3xl">6. C’est quoi un serveur ?</h2>
            </div>
            <p className="text-base leading-8 text-[#4B5563] sm:text-lg">
              Un ordinateur comme ton smartphone, ta tablette ou ton PC contient des fichiers, des images, des vidéos, des contacts et des documents. Un serveur, c’est exactement la même chose : c’est un ordinateur, mais qui reste constamment allumé et qui stocke les données pour les partager quand on lui demande.
            </p>
            <p className="mt-4 text-base leading-8 text-[#4B5563] sm:text-lg">
              Quand tu ouvres ton navigateur et tu tapes <span className="font-semibold text-[#191970]">mideessi.com</span>, ton smartphone envoie une demande à un autre ordinateur : le serveur. Celui-ci renvoie les pages du site et tu peux les lire grâce au navigateur.
            </p>
            <p className="mt-4 text-base leading-8 text-[#4B5563] sm:text-lg">
              En résumé : ton appareil demande, le serveur répond, et le navigateur affiche.
            </p>
          </section>

          <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF] text-[#191970]">
                <Globe size={18} />
              </div>
              <h2 className="text-2xl font-bold text-[#111827] sm:text-3xl">7. C’est quoi Internet ?</h2>
            </div>
            <p className="text-base leading-8 text-[#4B5563] sm:text-lg">
              Internet n’est pas simplement “ce que tu achètes chez un opérateur”. Internet est le réseau mondial qui réunit des milliers, voire des millions d’appareils connectés entre eux, capables d’échanger des informations et des fichiers.
            </p>
            <p className="mt-4 text-base leading-8 text-[#4B5563] sm:text-lg">
              Cela veut dire que ton ordinateur ou ton téléphone réussit à créer un lien avec d’autres appareils, à travers des infrastructures, des satellites, des câbles et des réseaux. C’est ce qu’on appelle Internet : le plus grand réseau du monde.
            </p>
            <p className="mt-4 text-base leading-8 text-[#4B5563] sm:text-lg">
              Quand tu souscris à un forfait auprès d’un opérateur mobile, tu rejoins ce grand réseau selon certaines règles, comme la validité du forfait ou la quantité de données que tu peux utiliser.
            </p>
          </section>

          <section className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF] text-[#191970]">
                <CheckCircle2 size={18} />
              </div>
              <h2 className="text-2xl font-bold text-[#111827] sm:text-3xl">8. Comment créer un site web ?</h2>
            </div>
            <p className="text-base leading-8 text-[#4B5563] sm:text-lg">
              Maintenant que l’on sait ce qu’est un site, où il se trouve et ce qu’est un serveur, on peut commencer à imaginer le notre. Le vrai travail consiste à organiser les informations, les pages, les liens et les outils qui serviront à donner vie au site.
            </p>
            <p className="mt-4 text-base leading-8 text-[#4B5563] sm:text-lg">
              La création d’un site web commence par une idée claire : quel est le but du site ? Qui est le public ? Quels contenus doivent être affichés ? Puis, on passe à la structure, au design et aux technologies qui permettront d’afficher et de faire fonctionner le site correctement.
            </p>
            <p className="mt-4 text-base leading-8 text-[#4B5563] sm:text-lg">
              C’est à ce moment-là que l’on comprend une vérité fondamentale : un site web n’est pas seulement une page jolie. C’est un système connecté, pensé pour communiquer, informer, vendre, enseigner et créer de la valeur.
            </p>
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Link to="/apprendre/formations/developpement-web/parcours" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#111827] shadow-sm">
            <ArrowLeft size={16} /> Retour au parcours
          </Link>
          <Link to="/apprendre/formations/developpement-web/quiz/fondamentaux-web" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#191970] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#191970]/20">
            Passer au quiz <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FondamentauxWeb;

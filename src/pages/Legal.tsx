import { ArrowLeft } from 'lucide-react';

const Legal = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#191970] to-[#0e1a4d] text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href="/"
            className="inline-flex items-center text-[#ffd700] hover:text-[#ffed4e] font-semibold mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </a>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Mentions légales et Politiques
          </h1>
          <p className="text-gray-200 text-base sm:text-lg">
            Informations légales, confidentialité et conditions d'utilisation de MIDEESSI
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Mentions Légales */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-[#ffd700]"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#191970] dark:text-white">
              Mentions légales
            </h2>
          </div>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Éditeur du site
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border-l-4 border-[#ffd700]">
                <p className="font-semibold">MIDEESSI TECH SARL</p>
                <p>Zogbo Maison 1953</p>
                <p>Cotonou, Bénin</p>
                <p className="mt-2">
                  <span className="font-semibold">Numéro RCCM :</span> RB/COT/26 B 43411
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Responsable de publication :</span> PDG - MIDEESSI
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Contact
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border-l-4 border-[#ffd700]">
                <p>
                  <span className="font-semibold">Email :</span> contact@mideessi.com
                </p>
                <p>
                  <span className="font-semibold">Téléphone :</span> +229 01 64 40 96 91
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Hébergement
              </h3>
              <p>
                Le site est hébergé chez Netlify. Netlify Inc., 2325 3rd St, Suite 215, San Francisco, CA 94107, États-Unis.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Propriété intellectuelle
              </h3>
              <p>
                Tous les contenus publiés sur ce site (textes, images, vidéos, graphiques, logos) sont la propriété exclusive de MIDEESSI TECH SARL ou de ses partenaires et sont protégés par les lois sur la propriété intellectuelle. Toute reproduction, distribution ou utilisation sans autorisation est strictement interdite.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Limitation de responsabilité
              </h3>
              <p>
                MIDEESSI TECH SARL s'efforce de fournir des informations exactes et à jour sur ce site. Cependant, nous ne guarantissons pas l'exactitude, la complétude ou l'actualité des contenus. L'utilisation de ce site se fait à vos propres risques. Nous déclinons toute responsabilité en cas de dommages directs ou indirects découlant de l'accès ou de l'utilisation du site.
              </p>
            </div>
          </div>
        </section>

        {/* Politique de Confidentialité */}
        <section className="mb-16" id="confidentialite">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-[#ffd700]"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#191970] dark:text-white">
              Politique de confidentialité
            </h2>
          </div>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <p>
              MIDEESSI TECH SARL s'engage à protéger votre vie privée et à traiter vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la législation béninoise applicable.
            </p>

            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Données collectées
              </h3>
              <p className="mb-3">Nous collectons les données personnelles suivantes :</p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <span className="font-semibold">Lors de l'inscription :</span> Email, nom d'utilisateur, mot de passe (hashé)
                </li>
                <li>
                  <span className="font-semibold">Lors de l'inscription à la newsletter :</span> Email
                </li>
                <li>
                  <span className="font-semibold">Lors d'un achat de PDF :</span> Email, données de paiement (traitées de manière sécurisée)
                </li>
                <li>
                  <span className="font-semibold">Données de navigation :</span> Adresse IP, type de navigateur, pages visitées (via Google Analytics)
                </li>
                <li>
                  <span className="font-semibold">Commentaires et interactions :</span> Contenu publié, dates de création
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Finalité du traitement
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Gestion de votre compte utilisateur</li>
                <li>Envoi de la newsletter et communications promotionnelles</li>
                <li>Traitement des paiements et facturation</li>
                <li>Amélioration du service et analyse d'utilisation</li>
                <li>Conformité légale et prévention de fraude</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Base légale du traitement
              </h3>
              <p>
                Le traitement de vos données est fondé sur :
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Votre consentement explicite (newsletter, cookies)</li>
                <li>L'exécution d'un contrat (création de compte, achat)</li>
                <li>Obligations légales (facturation, prévention de fraude)</li>
                <li>Intérêts légitimes de MIDEESSI (amélioration du service)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Conservation des données
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Données de compte : Conservées aussi longtemps que le compte est actif, puis supprimées sur demande</li>
                <li>Données de paiement : Conservées selon les exigences légales (min. 5 ans)</li>
                <li>Données de newsletter : Conservées jusqu'au désabonnement</li>
                <li>Logs de navigation : Conservés 12 mois en archive</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Partage des données
              </h3>
              <p className="mb-3">
                Vos données personnelles ne sont jamais vendues. Elles peuvent être partagées avec :
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Prestataires techniques (Supabase pour stockage, Netlify pour hébergement)</li>
                <li>Prestataires de paiement (traitement sécurisé)</li>
                <li>Autorités compétentes si obligatoire légalement</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Vos droits
              </h3>
              <p className="mb-3">Vous disposez des droits suivants selon le RGPD :</p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <span className="font-semibold">Droit d'accès :</span> Demander une copie de vos données
                </li>
                <li>
                  <span className="font-semibold">Droit de rectification :</span> Corriger les données inexactes
                </li>
                <li>
                  <span className="font-semibold">Droit à l'oubli :</span> Demander la suppression de vos données
                </li>
                <li>
                  <span className="font-semibold">Droit de limitation :</span> Limiter le traitement
                </li>
                <li>
                  <span className="font-semibold">Droit de portabilité :</span> Recevoir vos données dans un format standard
                </li>
                <li>
                  <span className="font-semibold">Droit d'opposition :</span> S'opposer au traitement
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Cookies
              </h3>
              <p>
                Ce site utilise des cookies pour améliorer votre expérience. Vous pouvez gérer vos préférences de cookies via la banneau de consentement. Pour plus d'informations sur les cookies utilisés, consultez notre politique de cookies.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Exercer vos droits
              </h3>
              <p>
                Pour exercer l'un de vos droits, veuillez nous envoyer une demande à
                <a
                  href="mailto:contact@mideessi.com"
                  className="text-[#ffd700] hover:text-[#ffed4e] font-semibold"
                >
                  {' '}
                  contact@mideessi.com
                </a>
                {' '}
                avec la mention de votre demande et une copie de votre pièce d'identité. Nous traiterons votre demande dans les 30 jours.
              </p>
            </div>
          </div>
        </section>

        {/* Conditions d'utilisation */}
        <section id="conditions">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-[#ffd700]"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#191970] dark:text-white">
              Conditions d'utilisation
            </h2>
          </div>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Acceptation des conditions
              </h3>
              <p>
                En accédant à ce site et en utilisant ses services, vous acceptez ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Utilisation du site
              </h3>
              <p className="mb-3">Vous vous engagez à :</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Utiliser ce site à des fins légales uniquement</li>
                <li>Ne pas diffuser de contenu nuisible, offensant ou discriminatoire</li>
                <li>Ne pas tenter de pirater ou d'accéder sans autorisation aux systèmes du site</li>
                <li>Ne pas collecter des données sans autorisation</li>
                <li>Respecter les droits de propriété intellectuelle</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Contenu utilisateur
              </h3>
              <p>
                Si vous publiez du contenu (commentaires, articles, etc.), vous accordez à MIDEESSI TECH SARL une licence non-exclusive pour utiliser, reproduire et afficher ce contenu. Vous restez responsable de ce que vous publiez.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Achats et paiements
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Les prix sont affichés en FCFA (Francs CFA)</li>
                <li>Tous les achats sont fermes sauf droit de rétractation légal</li>
                <li>Les paiements sont traités de manière sécurisée</li>
                <li>Les PDF achetés sont à usage personnel uniquement</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Garantie et limitation de responsabilité
              </h3>
              <p className="mb-3">
                Ce site et ses contenus sont fournis "tels quels" sans garanties. MIDEESSI TECH SARL ne garantit pas :
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>L'absence d'interruptions ou d'erreurs</li>
                <li>La sécurité des données (bien que nous utilisions le chiffrement)</li>
                <li>L'exactitude ou la complétude des contenus</li>
              </ul>
              <p className="mt-3">
                En aucun cas MIDEESSI TECH SARL ne sera responsable des dommages indirects, accessoires ou consécutifs découlant de l'utilisation du site.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Suspension et résiliation
              </h3>
              <p>
                MIDEESSI TECH SARL se réserve le droit de suspendre ou de résilier votre accès au site si vous violez ces conditions ou les lois applicables.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Modifications des conditions
              </h3>
              <p>
                Ces conditions peuvent être modifiées à tout moment. Les modifications prennent effet dès leur publication. Nous vous encourageons à consulter régulièrement cette page.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#191970] dark:text-white mb-2">
                Loi applicable
              </h3>
              <p>
                Ces conditions sont régies par la loi béninoise. En cas de litige, vous acceptez la juridiction des tribunaux compétents au Bénin.
              </p>
            </div>

            <div className="mt-8 p-4 sm:p-6 bg-[#ffd700]/10 border-l-4 border-[#ffd700] rounded">
              <p className="text-sm sm:text-base">
                <span className="font-bold">Dernière mise à jour :</span> {new Date().toLocaleDateString('fr-FR')}
              </p>
              <p className="text-sm mt-2">
                Pour toute question ou demande,{' '}
                <a
                  href="mailto:contact@mideessi.com"
                  className="text-[#ffd700] hover:text-[#ffed4e] font-semibold"
                >
                  nous contacter
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Legal;

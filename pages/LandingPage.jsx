import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  const [menuOuvert, setMenuOuvert] = useState(false);

  // Quelques offres fictives pour l'affichage sur la page d'accueil
  const offresExemple = [
    {
      id: 1,
      titre: "Développeur web junior",
      entreprise: "Orange Bénin",
      ville: "Cotonou",
      duree: "3 mois",
      badge: "Nouveau",
      badgeColor: "bg-green-100 text-green-700",
    },
    {
      id: 2,
      titre: "Analyste financier stagiaire",
      entreprise: "Ecobank",
      ville: "Cotonou",
      duree: "6 mois",
      badge: "Populaire",
      badgeColor: "bg-red-100 text-red-600",
    },
    {
      id: 3,
      titre: "Stage marketing digital",
      entreprise: "Moov Africa",
      ville: "Cotonou",
      duree: "2 mois",
      badge: "Ouvert",
      badgeColor: "bg-blue-100 text-blue-700",
    },
  ];

  const etapes = [
    {
      num: "01",
      titre: "Créez votre profil",
      desc: "Renseignez votre filière, niveau d'études et téléchargez votre CV en PDF.",
      icone: "👤",
    },
    {
      num: "02",
      titre: "Parcourez les offres",
      desc: "Filtrez par secteur, ville ou durée. Sauvegardez vos offres préférées.",
      icone: "🔍",
    },
    {
      num: "03",
      titre: "Postulez et suivez",
      desc: "Envoyez votre candidature en 2 minutes. Recevez des notifications par e-mail.",
      icone: "📨",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">

      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-12 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-blue-600">
          Stage<span className="text-slate-800">Link</span>
        </div>

        <ul className="hidden md:flex gap-8 list-none">
          <li>
            <a href="#offres" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
              Offres de stage
            </a>
          </li>
          <li>
            <a href="#entreprises" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
              Entreprises
            </a>
          </li>
          <li>
            <a href="#comment" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
              Comment ça marche
            </a>
          </li>
        </ul>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/connexion")}
            className="px-5 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition"
          >
            Se connecter
          </button>
          <button
            onClick={() => navigate("/inscription")}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
          >
            Créer un compte
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-12 py-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-6">
            Plateforme de stages au Bénin
          </span>
          <h1 className="text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-5">
            Trouvez votre stage.<br />
            <span className="text-blue-600">Sans se déplacer.</span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-md">
            StageLink connecte les étudiants béninois aux entreprises qui recrutent.
            Consultez les offres, postulez en ligne et suivez vos candidatures depuis un seul endroit.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/offres")}
              className="px-7 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Voir les offres
            </button>
            <button
              onClick={() => navigate("/inscription")}
              className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 transition"
            >
              Je suis une entreprise →
            </button>
          </div>
        </div>

        {/* Aperçu des offres */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          {offresExemple.map((offre) => (
            <div
              key={offre.id}
              className="bg-white border border-slate-200 rounded-xl p-4 mb-3 flex items-center gap-3 last:mb-0"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-sm font-bold text-slate-500 shrink-0">
                {offre.entreprise.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{offre.titre}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {offre.entreprise} · {offre.ville} · {offre.duree}
                </p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${offre.badgeColor}`}>
                {offre.badge}
              </span>
            </div>
          ))}

          {/* Stats */}
          <div className="flex gap-6 mt-5 pt-5 border-t border-slate-200">
            <div>
              <p className="text-2xl font-bold text-blue-600">120+</p>
              <p className="text-xs text-slate-400">Offres actives</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">50+</p>
              <p className="text-xs text-slate-400">Entreprises</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">300+</p>
              <p className="text-xs text-slate-400">Étudiants inscrits</p>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-slate-200 mx-12" />

      {/* COMMENT CA MARCHE */}
      <section id="comment" className="max-w-6xl mx-auto px-12 py-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">
          Comment ça marche
        </p>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
          Trouvez un stage en 3 étapes
        </h2>
        <p className="text-slate-500 mb-14 max-w-md leading-relaxed">
          Un processus simple, pensé pour les étudiants béninois.
          Pas de déplacement, pas d'attente en accueil.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {etapes.map((etape) => (
            <div key={etape.num} className="border border-slate-200 rounded-xl p-7 bg-white">
              <p className="text-xs font-bold text-blue-600 tracking-widest mb-4 flex items-center gap-2 after:flex-1 after:h-px after:bg-slate-200">
                {etape.num}
              </p>
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-xl mb-4">
                {etape.icone}
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{etape.titre}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{etape.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POUR QUI */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Pour qui</p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Deux espaces, un seul objectif
          </h2>
          <p className="text-slate-500 mb-12 max-w-md leading-relaxed">
            StageLink est conçu pour les étudiants comme pour les entreprises béninoises.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Étudiant */}
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-8">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4">
                🎓
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Étudiant</h3>
              <p className="text-sm text-slate-400 mb-5">En recherche de stage académique</p>
              <ul className="space-y-3">
                {["Profil avec CV en ligne", "Moteur de recherche avec filtres", "Candidature en 2 minutes", "Suivi en temps réel", "Notifications par e-mail"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="text-blue-600 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/inscription")}
                className="mt-7 w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Créer mon profil étudiant
              </button>
            </div>

            {/* Entreprise */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4">
                🏢
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Entreprise</h3>
              <p className="text-sm text-slate-400 mb-5">Vous cherchez un stagiaire</p>
              <ul className="space-y-3">
                {["Publication d'offres simplifiée", "Réception des candidatures", "Gestion des dossiers", "Tableau de bord recruteur", "Accès gratuit en phase pilote"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="text-blue-600 font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/inscription")}
                className="mt-7 w-full py-2.5 border border-blue-600 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-50 transition"
              >
                Inscrire mon entreprise
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 px-12 py-6 flex items-center justify-between">
        <div className="text-sm font-bold text-blue-600">StageLink</div>
        <ul className="flex gap-6 list-none">
          <li><a href="#" className="text-xs text-slate-400 hover:text-blue-600">A propos</a></li>
          <li><a href="#" className="text-xs text-slate-400 hover:text-blue-600">Contact</a></li>
          <li><a href="#" className="text-xs text-slate-400 hover:text-blue-600">Confidentialité</a></li>
        </ul>
      </footer>

    </div>
  );
}

export default LandingPage;

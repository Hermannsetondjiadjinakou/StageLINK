import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getOffres, ajouterFavori, supprimerFavori, getFavoris } from "../api";

function ListeOffres() {
  const navigate = useNavigate();

  const [offres, setOffres] = useState([]);
  const [favoris, setFavoris] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  const [recherche, setRecherche] = useState("");
  const [filtreVille, setFiltreVille] = useState("");
  const [filtreSecteur, setFiltreSecteur] = useState("");
  const [filtreDuree, setFiltreDuree] = useState("");

  useEffect(() => {
    chargerOffres();
    chargerFavoris();
  }, []);

  const chargerOffres = async () => {
    setChargement(true);
    setErreur("");
    try {
      const filtres = {};
      if (recherche) filtres.search = recherche;
      if (filtreVille) filtres.city = filtreVille;
      if (filtreSecteur) filtres.sector = filtreSecteur;
      if (filtreDuree) filtres.duration = filtreDuree;

      const data = await getOffres(filtres);
      setOffres(data.data || data);
    } catch (err) {
      setErreur("Impossible de charger les offres. Vérifiez que le serveur Laravel est lancé.");
    } finally {
      setChargement(false);
    }
  };

  const chargerFavoris = async () => {
    try {
      const data = await getFavoris();
      setFavoris((data.data || data).map((f) => f.offer_id));
    } catch {
      // Utilisateur non connecté, on ignore
    }
  };

  const toggleFavori = async (e, offreId) => {
    e.stopPropagation();
    try {
      if (favoris.includes(offreId)) {
        await supprimerFavori(offreId);
        setFavoris((prev) => prev.filter((f) => f !== offreId));
      } else {
        await ajouterFavori(offreId);
        setFavoris((prev) => [...prev, offreId]);
      }
    } catch {
      alert("Connectez-vous pour sauvegarder une offre.");
    }
  };

  const handleRecherche = (e) => {
    e.preventDefault();
    chargerOffres();
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="etudiant" />

      <main className="ml-16 flex-1 flex flex-col">
        <Topbar titre="Offres de stage" />

        <div className="p-8 flex-1">

          <form onSubmit={handleRecherche} className="bg-white border border-slate-200 rounded-xl p-4 mb-5 flex gap-3 flex-wrap items-center">
            <div className="flex-1 min-w-48 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Rechercher un stage, une entreprise..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-50 bg-slate-50"
              />
            </div>

            <select value={filtreSecteur} onChange={(e) => setFiltreSecteur(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:border-blue-600 bg-white">
              <option value="">Tous les secteurs</option>
              <option>Informatique</option>
              <option>Finance</option>
              <option>Marketing</option>
              <option>BTP</option>
              <option>Santé</option>
            </select>

            <select value={filtreVille} onChange={(e) => setFiltreVille(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:border-blue-600 bg-white">
              <option value="">Toutes les villes</option>
              <option>Cotonou</option>
              <option>Porto-Novo</option>
              <option>Parakou</option>
              <option>Abomey-Calavi</option>
            </select>

            <select value={filtreDuree} onChange={(e) => setFiltreDuree(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:border-blue-600 bg-white">
              <option value="">Durée</option>
              <option value="8">2 mois</option>
              <option value="12">3 mois</option>
              <option value="24">6 mois</option>
            </select>

            <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition">
              Rechercher
            </button>
          </form>

          {erreur && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
              {erreur}
            </div>
          )}

          {chargement && (
            <p className="text-sm text-slate-400 mb-5">Chargement des offres...</p>
          )}

          {!chargement && !erreur && offres.length === 0 && (
            <p className="text-sm text-slate-400 mb-5">Aucune offre ne correspond à votre recherche.</p>
          )}

          {!chargement && offres.length > 0 && (
            <p className="text-sm text-slate-500 mb-4">
              <span className="font-bold text-slate-900">{offres.length}</span> offres disponibles
            </p>
          )}

          <div className="grid grid-cols-3 gap-4 mb-6">
            {offres.map((offre) => (
              <div
                key={offre.id}
                onClick={() => navigate(`/offres/${offre.id}`)}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3 hover:border-blue-300 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 shrink-0">
                    {(offre.company_name || offre.company?.company_name || "EN").slice(0, 2).toUpperCase()}
                  </div>
                  <button
                    onClick={(e) => toggleFavori(e, offre.id)}
                    className={`text-lg transition ${favoris.includes(offre.id) ? "text-blue-600" : "text-slate-300 hover:text-blue-400"}`}
                  >
                    🔖
                  </button>
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">{offre.title}</p>
                  <p className="text-xs text-slate-400">{offre.company_name || offre.company?.company_name}</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full flex items-center gap-1">
                    📍 {offre.city}
                  </span>
                  <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                    ⏱ {offre.duration} semaines
                  </span>
                  {offre.level && (
                    <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                      {offre.level}
                    </span>
                  )}
                  {offre.sector && (
                    <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                      {offre.sector}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    📅 Expire le {offre.deadline ? new Date(offre.deadline).toLocaleDateString("fr-FR") : "—"}
                  </p>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-semibold px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Postuler
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}

export default ListeOffres;

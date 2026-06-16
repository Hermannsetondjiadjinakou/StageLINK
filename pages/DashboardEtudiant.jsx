import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { mesCandidatures, getFavoris } from "../api";

// Correspondance entre les statuts de l'API et l'affichage
const statutsAffichage = {
  pending: { label: "En attente", couleur: "bg-yellow-100 text-yellow-700" },
  interview: { label: "En examen", couleur: "bg-sky-100 text-sky-700" },
  accepted: { label: "Retenu", couleur: "bg-green-100 text-green-700" },
  rejected: { label: "Non retenu", couleur: "bg-red-100 text-red-600" },
};

function DashboardEtudiant() {
  const [candidatures, setCandidatures] = useState([]);
  const [favoris, setFavoris] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  const utilisateur = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    setChargement(true);
    setErreur("");
    try {
      const [resCandidatures, resFavoris] = await Promise.all([
        mesCandidatures(),
        getFavoris(),
      ]);
      setCandidatures(resCandidatures.data || resCandidatures);
      setFavoris(resFavoris.data || resFavoris);
    } catch (err) {
      setErreur("Impossible de charger vos données. Vérifiez votre connexion.");
    } finally {
      setChargement(false);
    }
  };

  // Calcul des stats à partir des candidatures réelles
  const nbEnAttente = candidatures.filter((c) => c.status === "pending").length;
  const nbEnExamen = candidatures.filter((c) => c.status === "interview").length;

  const stats = [
    { label: "Candidatures envoyées", valeur: candidatures.length, icon: "📨", bg: "bg-blue-50", color: "text-blue-600" },
    { label: "En attente", valeur: nbEnAttente, icon: "⏳", bg: "bg-yellow-50", color: "text-yellow-600" },
    { label: "En cours d'examen", valeur: nbEnExamen, icon: "👁", bg: "bg-sky-50", color: "text-sky-600" },
    { label: "Offres sauvegardées", valeur: favoris.length, icon: "🔖", bg: "bg-purple-50", color: "text-purple-600" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="etudiant" />

      <main className="ml-16 flex-1 flex flex-col">
        <Topbar sousTitre="Bonjour," titre={utilisateur.name || "Étudiant"} />

        <div className="p-8 flex-1">

          {erreur && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
              {erreur}
            </div>
          )}

          {chargement ? (
            <p className="text-sm text-slate-400">Chargement de votre tableau de bord...</p>
          ) : (
            <>
              {/* STATS */}
              <div className="grid grid-cols-4 gap-4 mb-7">
                {stats.map((s) => (
                  <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4">
                    <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center text-xl`}>
                      {s.icon}
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${s.color}`}>{s.valeur}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-5 mb-5">

                {/* Candidatures */}
                <div className="col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Mes candidatures récentes</p>
                  </div>
                  {candidatures.length === 0 ? (
                    <p className="text-sm text-slate-400 px-5 py-6">Vous n'avez encore postulé à aucune offre.</p>
                  ) : (
                    candidatures.slice(0, 5).map((c) => {
                      const statut = statutsAffichage[c.status] || statutsAffichage.pending;
                      return (
                        <div key={c.id} className="px-5 py-4 border-b border-slate-50 flex items-center gap-3 last:border-b-0">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                            {(c.company_name || c.offer_title || "OF").slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{c.offer_title || "Offre"}</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {c.company_name} · {new Date(c.created_at).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statut.couleur}`}>
                            {statut.label}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Profil */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Mon profil</p>
                    <a href="/profil" className="text-xs text-blue-600">Modifier ✎</a>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-base shrink-0">
                        {(utilisateur.name || "ET").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{utilisateur.name}</p>
                        <p className="text-xs text-slate-400">{utilisateur.filiere} · {utilisateur.niveau}</p>
                      </div>
                    </div>
                    <div className="space-y-2.5 text-xs text-slate-500">
                      <p>📧 {utilisateur.email}</p>
                      {utilisateur.phone && <p>📞 {utilisateur.phone}</p>}
                    </div>

                    {utilisateur.cv_path ? (
                      <div className="mt-4 p-3 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center gap-2">
                        <span className="text-blue-600 text-xl">📄</span>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-700">CV uploadé</p>
                        </div>
                        <a href="/profil" className="text-xs text-blue-600 font-medium">Remplacer</a>
                      </div>
                    ) : (
                      <div className="mt-4 p-3 bg-orange-50 border border-dashed border-orange-300 rounded-lg">
                        <p className="text-xs text-orange-600">Aucun CV téléchargé. Ajoutez-en un depuis votre profil.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* FAVORIS */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Offres sauvegardées</p>
                  <a href="/offres" className="text-xs text-blue-600">Voir toutes les offres →</a>
                </div>
                {favoris.length === 0 ? (
                  <p className="text-sm text-slate-400 px-5 py-6">Vous n'avez pas encore sauvegardé d'offre.</p>
                ) : (
                  favoris.map((f) => (
                    <div key={f.saved_id || f.id} className="px-5 py-4 border-b border-slate-50 flex items-center gap-3 last:border-b-0">
                      <div className="w-2 h-2 rounded-full bg-blue-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{f.title || "Offre"}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{f.company_name}</p>
                      </div>
                      <a href={`/offres/${f.offer_id}`} className="text-xs text-blue-600 font-medium border border-blue-200 bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition">
                        Voir
                      </a>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}

export default DashboardEtudiant;

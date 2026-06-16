import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getOffres, candidaturesRecues, pauseOffre, supprimerOffre } from "../api";

const statutsAffichage = {
  pending: { label: "En attente", couleur: "bg-yellow-100 text-yellow-700" },
  interview: { label: "En examen", couleur: "bg-sky-100 text-sky-700" },
  accepted: { label: "Retenu", couleur: "bg-green-100 text-green-700" },
  rejected: { label: "Non retenu", couleur: "bg-red-100 text-red-600" },
};

function DashboardRecruteur() {
  const [offres, setOffres] = useState([]);
  const [candidatures, setCandidatures] = useState([]);
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
      const [resOffres, resCandidatures] = await Promise.all([
        getOffres(),
        candidaturesRecues(),
      ]);
      // On ne garde que les offres de cette entreprise (l'API peut déjà filtrer côté serveur)
      setOffres(resOffres.data || resOffres);
      setCandidatures(resCandidatures.data || resCandidatures);
    } catch (err) {
      setErreur("Impossible de charger vos données.");
    } finally {
      setChargement(false);
    }
  };

  const handlePause = async (id) => {
    try {
      await pauseOffre(id);
      chargerDonnees();
    } catch {
      alert("Impossible de mettre cette offre en pause.");
    }
  };

  const handleSupprimer = async (id) => {
    if (!confirm("Supprimer cette offre définitivement ?")) return;
    try {
      await supprimerOffre(id);
      chargerDonnees();
    } catch {
      alert("Impossible de supprimer cette offre.");
    }
  };

  const nbNonTraitees = candidatures.filter((c) => c.status === "pending").length;

  const stats = [
    { label: "Offres actives", valeur: offres.filter((o) => o.status === "active").length, icon: "💼", bg: "bg-blue-50", color: "text-blue-600" },
    { label: "Candidatures reçues", valeur: candidatures.length, icon: "👥", bg: "bg-green-50", color: "text-green-600" },
    { label: "Non traitées", valeur: nbNonTraitees, icon: "⏳", bg: "bg-yellow-50", color: "text-yellow-600" },
  ];

  const statutsCandidatures = [
    { label: "En attente", val: candidatures.filter((c) => c.status === "pending").length, dot: "bg-yellow-400" },
    { label: "En cours d'examen", val: candidatures.filter((c) => c.status === "interview").length, dot: "bg-blue-500" },
    { label: "Retenus", val: candidatures.filter((c) => c.status === "accepted").length, dot: "bg-green-500" },
    { label: "Non retenus", val: candidatures.filter((c) => c.status === "rejected").length, dot: "bg-red-500" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="recruteur" />

      <main className="ml-16 flex-1 flex flex-col">
        <Topbar
          sousTitre="Espace recruteur"
          titre={utilisateur.company_name || "Entreprise"}
          bouton={
            <a href="/mes-offres" className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition">
              + Publier une offre
            </a>
          }
        />

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
              <div className="grid grid-cols-3 gap-4 mb-7">
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

                <div className="col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">Mes offres publiées</p>
                  </div>
                  {offres.length === 0 ? (
                    <p className="text-sm text-slate-400 px-5 py-6">Vous n'avez publié aucune offre pour le moment.</p>
                  ) : (
                    offres.map((o) => (
                      <div key={o.id} className="px-5 py-4 border-b border-slate-50 flex items-center gap-3 last:border-b-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{o.title}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                            <span>📍 {o.city}</span>
                            <span>⏱ {o.duration} semaines</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${o.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                            {o.status === "active" ? "Active" : o.status === "paused" ? "En pause" : "Archivée"}
                          </span>
                          <button onClick={() => handlePause(o.id)} className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-xs text-slate-500 hover:bg-slate-50">
                            {o.status === "active" ? "⏸" : "▶"}
                          </button>
                          <button onClick={() => handleSupprimer(o.id)} className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-xs text-red-400 hover:bg-red-50 hover:border-red-200">
                            🗑
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">Candidatures par statut</p>
                  </div>
                  <div className="p-5 space-y-4">
                    {statutsCandidatures.map((s) => (
                      <div key={s.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </div>
                        <span className="text-base font-bold text-slate-800">{s.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">Candidatures récentes</p>
                </div>
                {candidatures.length === 0 ? (
                  <p className="text-sm text-slate-400 px-5 py-6">Aucune candidature reçue pour le moment.</p>
                ) : (
                  <div className="grid grid-cols-2">
                    {candidatures.slice(0, 6).map((c) => {
                      const statut = statutsAffichage[c.status] || statutsAffichage.pending;
                      return (
                        <div key={c.id} className="px-5 py-4 border-b border-r border-slate-50 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">
                            {(c.student_name || "ET").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800">{c.student_name}</p>
                            <p className="text-xs text-slate-400 truncate">{c.offer_title}</p>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statut.couleur}`}>
                            {statut.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}

export default DashboardRecruteur;

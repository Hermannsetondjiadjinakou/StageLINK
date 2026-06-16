import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getStats, getEntreprisesEnAttente, validerEntreprise, rejeterEntreprise } from "../api";

function DashboardAdmin() {
  const [stats, setStats] = useState(null);
  const [entreprisesEnAttente, setEntreprisesEnAttente] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    setChargement(true);
    setErreur("");
    try {
      const [resStats, resEntreprises] = await Promise.all([
        getStats(),
        getEntreprisesEnAttente(),
      ]);
      setStats(resStats.data || resStats);
      setEntreprisesEnAttente(resEntreprises.data || resEntreprises);
    } catch (err) {
      setErreur("Impossible de charger les données d'administration.");
    } finally {
      setChargement(false);
    }
  };

  const handleValider = async (id) => {
    try {
      await validerEntreprise(id);
      chargerDonnees();
    } catch {
      alert("Impossible de valider cette entreprise.");
    }
  };

  const handleRejeter = async (id) => {
    if (!confirm("Rejeter cette entreprise ?")) return;
    try {
      await rejeterEntreprise(id);
      chargerDonnees();
    } catch {
      alert("Impossible de rejeter cette entreprise.");
    }
  };

  const statsAffichees = [
    { label: "Étudiants inscrits", valeur: stats?.students ?? 0, icon: "🎓", bg: "bg-blue-50", color: "text-blue-600" },
    { label: "Entreprises", valeur: stats?.companies ?? 0, icon: "🏢", bg: "bg-purple-50", color: "text-purple-600" },
    { label: "Offres actives", valeur: stats?.offers_active ?? 0, icon: "💼", bg: "bg-green-50", color: "text-green-600" },
    { label: "Candidatures totales", valeur: stats?.applications ?? 0, icon: "📨", bg: "bg-orange-50", color: "text-orange-600" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="admin" />

      <main className="ml-16 flex-1 flex flex-col">
        <Topbar sousTitre="Administration" titre="Tableau de bord" />

        <div className="p-8 flex-1">

          {erreur && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
              {erreur}
            </div>
          )}

          {chargement ? (
            <p className="text-sm text-slate-400">Chargement...</p>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-4 mb-7">
                {statsAffichees.map((s) => (
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

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Entreprises en attente de validation</p>
                  <span className="text-xs text-slate-400">{entreprisesEnAttente.length} en attente</span>
                </div>

                {entreprisesEnAttente.length === 0 ? (
                  <p className="text-sm text-slate-400 px-5 py-6">Aucune entreprise en attente de validation.</p>
                ) : (
                  entreprisesEnAttente.map((e) => (
                    <div key={e.id} className="px-5 py-4 border-b border-slate-50 flex items-center gap-3 last:border-b-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                        {(e.company_name || "EN").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800">{e.company_name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {e.sector} · {e.city} · Inscrite le {new Date(e.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleValider(e.id)} className="px-3 py-1.5 bg-green-100 text-green-700 border border-green-200 text-xs font-semibold rounded-md hover:bg-green-200 transition">
                          Valider
                        </button>
                        <button onClick={() => handleRejeter(e.id)} className="px-3 py-1.5 bg-red-100 text-red-600 border border-red-200 text-xs font-semibold rounded-md hover:bg-red-200 transition">
                          Rejeter
                        </button>
                      </div>
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

export default DashboardAdmin;

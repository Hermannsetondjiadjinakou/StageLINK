import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getOffre, postuler } from "../api";

function DetailOffre() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [offre, setOffre] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  const [motivation, setMotivation] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [envoye, setEnvoye] = useState(false);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreurCandidature, setErreurCandidature] = useState("");

  useEffect(() => {
    chargerOffre();
  }, [id]);

  const chargerOffre = async () => {
    setChargement(true);
    setErreur("");
    try {
      const data = await getOffre(id);
      setOffre(data.data || data);
    } catch (err) {
      setErreur("Impossible de charger cette offre.");
    } finally {
      setChargement(false);
    }
  };

  const handlePostuler = async (e) => {
    e.preventDefault();
    setErreurCandidature("");

    if (!cvFile) {
      setErreurCandidature("Veuillez joindre votre CV au format PDF.");
      return;
    }

    setEnvoiEnCours(true);
    try {
      const formData = new FormData();
      formData.append("offer_id", offre.id);
      formData.append("cv", cvFile);
      formData.append("motivation", motivation);
      await postuler(formData);
      setEnvoye(true);
    } catch (err) {
      setErreurCandidature(err.message || "Impossible d'envoyer la candidature.");
    } finally {
      setEnvoiEnCours(false);
    }
  };

  if (chargement) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar role="etudiant" />
        <main className="ml-16 flex-1 flex items-center justify-center">
          <p className="text-sm text-slate-400">Chargement de l'offre...</p>
        </main>
      </div>
    );
  }

  if (erreur || !offre) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar role="etudiant" />
        <main className="ml-16 flex-1 flex items-center justify-center">
          <p className="text-sm text-red-500">{erreur || "Offre introuvable."}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="etudiant" />

      <main className="ml-16 flex-1 flex flex-col">
        <Topbar
          titre={offre.title}
          bouton={
            <button onClick={() => navigate("/offres")} className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1">
              ← Retour aux offres
            </button>
          }
        />

        <div className="p-8 flex-1">
          <div className="grid grid-cols-3 gap-6 items-start">

            {/* COLONNE GAUCHE */}
            <div className="col-span-2 space-y-4">

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-base font-bold text-slate-500 shrink-0">
                    {(offre.company_name || offre.company?.company_name || "EN").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-bold text-slate-900 mb-1">{offre.title}</h1>
                    <p className="text-sm text-blue-600 font-medium">{offre.company_name || offre.company?.company_name}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                    📍 {offre.city}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                    ⏱ {offre.duration} semaines
                  </span>
                  {offre.level && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                      🎓 {offre.level}
                    </span>
                  )}
                  {offre.sector && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                      🏢 {offre.sector}
                    </span>
                  )}
                  {offre.compensation && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                      💰 {offre.compensation}
                    </span>
                  )}
                  {offre.deadline && (
                    <span className="flex items-center gap-1.5 text-xs bg-orange-50 border border-orange-200 text-orange-600 px-3 py-1.5 rounded-lg">
                      📅 Expire le {new Date(offre.deadline).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                </div>
              </div>

              {offre.description && (
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h2 className="text-sm font-bold text-slate-900 mb-3">📋 Description du poste</h2>
                  <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">{offre.description}</p>
                </div>
              )}

              {offre.missions && (
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h2 className="text-sm font-bold text-slate-900 mb-3">✅ Missions</h2>
                  <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">{offre.missions}</p>
                </div>
              )}

              {offre.skills && (
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h2 className="text-sm font-bold text-slate-900 mb-3">💻 Compétences requises</h2>
                  <div className="flex flex-wrap gap-2">
                    {offre.skills.split(",").map((c) => (
                      <span key={c} className="text-xs font-medium px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                        {c.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* COLONNE DROITE */}
            <div className="sticky top-20 space-y-4">

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-blue-600 p-5">
                  <p className="text-white font-bold text-base">Postuler à cette offre</p>
                  <p className="text-blue-200 text-xs mt-0.5">Candidature en moins de 2 minutes</p>
                </div>

                <div className="p-5">
                  {envoye ? (
                    <div className="text-center py-4">
                      <p className="text-3xl mb-3">✅</p>
                      <p className="text-sm font-semibold text-slate-800 mb-1">Candidature envoyée !</p>
                      <p className="text-xs text-slate-400">Vous recevrez un e-mail de confirmation.</p>
                    </div>
                  ) : (
                    <form onSubmit={handlePostuler}>

                      {erreurCandidature && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2.5 mb-4">
                          {erreurCandidature}
                        </div>
                      )}

                      <div className="mb-4">
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          CV <span className="text-slate-400 font-normal">(PDF, 5 Mo max)</span>
                        </label>
                        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3 flex items-center gap-2">
                          <span className="text-blue-600 text-xl">📄</span>
                          <div className="flex-1 min-w-0">
                            <input
                              type="file"
                              accept="application/pdf"
                              required
                              onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                              className="w-full text-xs text-slate-600"
                            />
                            {cvFile && (
                              <p className="text-xs text-slate-400 mt-1 truncate">{cvFile.name}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Lettre de motivation <span className="text-slate-400 font-normal">(facultatif, max 1000 caractères)</span>
                        </label>
                        <textarea
                          rows={5}
                          placeholder="Expliquez en quelques lignes votre motivation..."
                          value={motivation}
                          onChange={(e) => setMotivation(e.target.value)}
                          maxLength={1000}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-50 resize-none font-sans"
                        />
                        <p className="text-right text-xs text-slate-400 mt-1">{motivation.length}/1000</p>
                      </div>

                      <button
                        type="submit"
                        disabled={envoiEnCours}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-60"
                      >
                        {envoiEnCours ? "Envoi en cours..." : "Envoyer ma candidature"}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 shrink-0">
                    {(offre.company_name || offre.company?.company_name || "EN").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{offre.company_name || offre.company?.company_name}</p>
                    <p className="text-xs text-slate-400">{offre.sector}</p>
                  </div>
                </div>
                <div className="space-y-2.5 text-xs text-slate-500">
                  <p>📍 {offre.city}, Bénin</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DetailOffre;

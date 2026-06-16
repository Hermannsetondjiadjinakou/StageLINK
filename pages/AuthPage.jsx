import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api";

function AuthPage() {
  const navigate = useNavigate();
  const [onglet, setOnglet] = useState("connexion");
  const [role, setRole] = useState("etudiant");
  const [showPw, setShowPw] = useState(false);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const [formConnexion, setFormConnexion] = useState({ email: "", password: "" });
  const [formInscription, setFormInscription] = useState({
    nom: "", email: "", password: "", confirm: "",
    filiere: "", niveau: "", raisonSociale: "", secteur: "", ville: ""
  });

  const handleConnexion = async (e) => {
    e.preventDefault();
    setErreur("");
    setChargement(true);
    try {
      const res = await login(formConnexion.email, formConnexion.password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.user.role);
      localStorage.setItem("user", JSON.stringify(res.user));

      // Redirection selon le rôle
      if (res.user.role === "admin") navigate("/dashboard-admin");
      else if (res.user.role === "company") navigate("/dashboard-recruteur");
      else navigate("/dashboard-etudiant");
    } catch (err) {
      setErreur(err.message || "Email ou mot de passe incorrect.");
    } finally {
      setChargement(false);
    }
  };

  const handleInscription = async (e) => {
    e.preventDefault();
    setErreur("");

    if (formInscription.password !== formInscription.confirm) {
      setErreur("Les mots de passe ne correspondent pas.");
      return;
    }

    setChargement(true);
    try {
      const data = {
        name: formInscription.nom,
        email: formInscription.email,
        password: formInscription.password,
        password_confirmation: formInscription.confirm,
        role: role === "etudiant" ? "student" : "company",
        ...(role === "etudiant" && {
          filiere: formInscription.filiere,
          niveau: formInscription.niveau,
        }),
        ...(role === "entreprise" && {
          company_name: formInscription.raisonSociale,
          sector: formInscription.secteur,
          city: formInscription.ville,
        }),
      };

      const res = await register(data);
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.user.role);
      localStorage.setItem("user", JSON.stringify(res.user));

      if (res.user.role === "company") navigate("/dashboard-recruteur");
      else navigate("/dashboard-etudiant");
    } catch (err) {
      setErreur(err.message || "Une erreur est survenue.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b border-slate-200 px-12 py-4 flex items-center justify-between">
        <a href="/" className="text-lg font-bold text-blue-600">Stage<span className="text-slate-800">Link</span></a>
        <a href="/" className="text-sm text-slate-500 hover:text-blue-600">← Retour à l'accueil</a>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden">

          <div className="flex border-b border-slate-200">
            {["connexion", "inscription"].map((t) => (
              <button key={t} onClick={() => { setOnglet(t); setErreur(""); }}
                className={`flex-1 py-4 text-sm font-medium border-b-2 transition ${onglet === t ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
                {t === "connexion" ? "Se connecter" : "Créer un compte"}
              </button>
            ))}
          </div>

          <div className="p-8">

            {/* Message d'erreur */}
            {erreur && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2.5 mb-4">
                {erreur}
              </div>
            )}

            {onglet === "connexion" && (
              <form onSubmit={handleConnexion}>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Bon retour</h2>
                <p className="text-sm text-slate-500 mb-6">Connectez-vous pour accéder à votre espace.</p>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Adresse e-mail</label>
                  <input type="email" placeholder="vous@exemple.com" value={formConnexion.email}
                    onChange={(e) => setFormConnexion({ ...formConnexion, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-50" />
                </div>

                <div className="mb-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Mot de passe</label>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} placeholder="••••••••" value={formConnexion.password}
                      onChange={(e) => setFormConnexion({ ...formConnexion, password: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-50 pr-10" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                      {showPw ? "Cacher" : "Voir"}
                    </button>
                  </div>
                </div>

                <a href="#" className="block text-right text-xs text-blue-600 mb-5 hover:underline">Mot de passe oublié ?</a>

                <button type="submit" disabled={chargement}
                  className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-60">
                  {chargement ? "Connexion..." : "Se connecter"}
                </button>

                <p className="text-center text-xs text-slate-500 mt-5">
                  Pas encore de compte ?{" "}
                  <button type="button" onClick={() => setOnglet("inscription")} className="text-blue-600 font-medium">Créer un compte</button>
                </p>
              </form>
            )}

            {onglet === "inscription" && (
              <form onSubmit={handleInscription}>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Créer un compte</h2>
                <p className="text-sm text-slate-500 mb-5">Qui êtes-vous ?</p>

                <div className="flex flex-col gap-3 mb-5">
                  {[
                    { val: "etudiant", label: "Étudiant", desc: "Je cherche un stage pour valider mon cursus", icon: "🎓" },
                    { val: "entreprise", label: "Entreprise", desc: "Je publie des offres et gère mes stagiaires", icon: "🏢" },
                  ].map((item) => (
                    <label key={item.val} className={`flex items-center gap-3 border-2 rounded-xl p-4 cursor-pointer transition ${role === item.val ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-200"}`}>
                      <input type="radio" name="role" value={item.val} checked={role === item.val} onChange={() => setRole(item.val)} className="hidden" />
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl shrink-0">{item.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${role === item.val ? "border-blue-600 bg-blue-600" : "border-slate-300"}`}>
                        {role === item.val && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </label>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Nom complet</label>
                    <input type="text" placeholder="Jean Dupont" value={formInscription.nom}
                      onChange={(e) => setFormInscription({ ...formInscription, nom: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Adresse e-mail</label>
                    <input type="email" placeholder="vous@exemple.com" value={formInscription.email}
                      onChange={(e) => setFormInscription({ ...formInscription, email: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Mot de passe</label>
                    <input type="password" placeholder="Min. 8 caractères" value={formInscription.password}
                      onChange={(e) => setFormInscription({ ...formInscription, password: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Confirmer</label>
                    <input type="password" placeholder="••••••••" value={formInscription.confirm}
                      onChange={(e) => setFormInscription({ ...formInscription, confirm: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-50" />
                  </div>
                </div>

                {role === "etudiant" && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Filière</label>
                      <select value={formInscription.filiere} onChange={(e) => setFormInscription({ ...formInscription, filiere: e.target.value })}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-600 bg-white">
                        <option value="">Choisir...</option>
                        <option>Développement Web & Mobile</option>
                        <option>Informatique de Gestion</option>
                        <option>Finance & Comptabilité</option>
                        <option>Marketing & Commerce</option>
                        <option>Génie Civil / BTP</option>
                        <option>Santé</option>
                        <option>Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Niveau d'études</label>
                      <select value={formInscription.niveau} onChange={(e) => setFormInscription({ ...formInscription, niveau: e.target.value })}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-600 bg-white">
                        <option value="">Choisir...</option>
                        <option>Licence 1</option><option>Licence 2</option><option>Licence 3</option>
                        <option>Master 1</option><option>Master 2</option>
                      </select>
                    </div>
                  </div>
                )}

                {role === "entreprise" && (
                  <div className="mb-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 text-xs text-blue-700">
                      Votre compte sera examiné avant activation. Vous pouvez préparer vos offres en attendant.
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Raison sociale</label>
                        <input type="text" placeholder="Nom de l'entreprise" value={formInscription.raisonSociale}
                          onChange={(e) => setFormInscription({ ...formInscription, raisonSociale: e.target.value })}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-50" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Secteur</label>
                        <select value={formInscription.secteur} onChange={(e) => setFormInscription({ ...formInscription, secteur: e.target.value })}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-600 bg-white">
                          <option value="">Choisir...</option>
                          <option>Informatique & Tech</option><option>Finance & Banque</option>
                          <option>Marketing</option><option>BTP & Génie Civil</option>
                          <option>Santé</option><option>Commerce</option><option>Autre</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Ville</label>
                      <select value={formInscription.ville} onChange={(e) => setFormInscription({ ...formInscription, ville: e.target.value })}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-600 bg-white">
                        <option value="">Choisir...</option>
                        <option>Cotonou</option><option>Porto-Novo</option>
                        <option>Parakou</option><option>Abomey-Calavi</option><option>Autre</option>
                      </select>
                    </div>
                  </div>
                )}

                <button type="submit" disabled={chargement}
                  className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg text-sm hover:bg-blue-700 transition mt-1 disabled:opacity-60">
                  {chargement ? "Création en cours..." : "Créer mon compte"}
                </button>

                <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
                  En créant un compte, vous acceptez nos <a href="#" className="text-blue-600">Conditions d'utilisation</a>.
                </p>
                <p className="text-center text-xs text-slate-500 mt-3">
                  Déjà un compte ?{" "}
                  <button type="button" onClick={() => setOnglet("connexion")} className="text-blue-600 font-medium">Se connecter</button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;

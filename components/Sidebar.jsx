import { useNavigate, useLocation } from "react-router-dom";

// Les menus selon le rôle de l'utilisateur
const menus = {
  etudiant: [
    { label: "Tableau de bord", icon: "⊞", path: "/dashboard-etudiant" },
    { label: "Offres de stage", icon: "🔍", path: "/offres" },
    { label: "Mes candidatures", icon: "📄", path: "/mes-candidatures", badge: 4 },
    { label: "Favoris", icon: "🔖", path: "/favoris" },
    { label: "Mon profil", icon: "👤", path: "/profil" },
    { label: "Paramètres", icon: "⚙", path: "/parametres" },
  ],
  recruteur: [
    { label: "Tableau de bord", icon: "⊞", path: "/dashboard-recruteur" },
    { label: "Mes offres", icon: "💼", path: "/mes-offres" },
    { label: "Candidatures reçues", icon: "👥", path: "/candidatures-recues", badge: 7 },
    { label: "Profil entreprise", icon: "🏢", path: "/profil-entreprise" },
    { label: "Paramètres", icon: "⚙", path: "/parametres" },
  ],
  admin: [
    { label: "Tableau de bord", icon: "⊞", path: "/dashboard-admin" },
    { label: "Utilisateurs", icon: "👥", path: "/admin/utilisateurs" },
    { label: "Entreprises", icon: "🏢", path: "/admin/entreprises", badge: 3 },
    { label: "Offres de stage", icon: "💼", path: "/admin/offres" },
    { label: "Candidatures", icon: "📄", path: "/admin/candidatures" },
    { label: "Paramètres", icon: "⚙", path: "/parametres" },
  ],
};

// Initiales selon le rôle
const avatars = {
  etudiant: "KD",
  recruteur: "OB",
  admin: "AD",
};

function Sidebar({ role = "etudiant" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const items = menus[role] || menus.etudiant;

  return (
    <aside className="w-16 bg-slate-900 flex flex-col items-center fixed top-0 left-0 h-screen z-50 py-0 pb-4">

      {/* Logo */}
      <div className="w-full h-15 flex items-center justify-center border-b border-slate-700 py-4">
        <span className="text-white font-extrabold text-sm tracking-tight">SL</span>
      </div>

      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold mt-4 mb-2 border-2 border-slate-600">
        {avatars[role]}
      </div>

      {/* Menu */}
      <nav className="flex flex-col items-center gap-1 w-full px-2 flex-1 mt-1">
        {items.map((item, i) => {
          const estActif = location.pathname === item.path;

          // Séparateur avant "Mon profil" / "Profil entreprise"
          const afficherSeparateur =
            (role === "etudiant" && i === 4) ||
            (role === "recruteur" && i === 3) ||
            (role === "admin" && i === 5);

          return (
            <div key={item.path} className="w-full flex flex-col items-center">
              {afficherSeparateur && (
                <div className="w-8 h-px bg-slate-700 my-1" />
              )}
              <div className="relative group w-full flex justify-center">
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg transition relative ${
                    estActif
                      ? "bg-blue-600 text-white"
                      : "text-slate-500 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.badge && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-slate-900">
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Tooltip au survol */}
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Déconnexion */}
      <div className="relative group w-full flex justify-center px-2">
        <button
          onClick={() => navigate("/")}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-red-500 hover:bg-slate-700 transition text-lg"
        >
          ⏻
        </button>
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
          Déconnexion
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

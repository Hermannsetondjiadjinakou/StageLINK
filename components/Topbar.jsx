// Barre du haut commune à tous les dashboards
function Topbar({ titre, sousTitre, bouton }) {
  return (
    <div className="bg-white border-b border-slate-200 h-15 px-8 flex items-center justify-between sticky top-0 z-10 py-3">
      <div>
        {sousTitre && <p className="text-xs text-slate-400">{sousTitre}</p>}
        <p className="text-sm font-bold text-slate-900">{titre}</p>
      </div>
      <div className="flex items-center gap-3">
        {bouton && bouton}
        <button className="relative w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
          🔔
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full border border-white" />
        </button>
      </div>
    </div>
  );
}

export default Topbar;

// URL de base de l'API Laravel
const BASE_URL = "http://localhost:8000/api";

// Fonction utilitaire pour faire les requêtes
async function request(method, endpoint, data = null) {
  const token = localStorage.getItem("token");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Erreur serveur");
  }

  return json;
}

// ─── AUTHENTIFICATION ───────────────────────────────────────────────────────

export const login = (email, password) =>
  request("POST", "/login", { email, password });

export const register = (data) => request("POST", "/register", data);

export const logout = () => request("POST", "/logout");

export const getMe = () => request("GET", "/me");

// ─── OFFRES ─────────────────────────────────────────────────────────────────

export const getOffres = (filtres = {}) => {
  const params = new URLSearchParams(filtres).toString();
  return request("GET", `/offers${params ? "?" + params : ""}`);
};

export const getOffre = (id) => request("GET", `/offers/${id}`);

export const creerOffre = (data) => request("POST", "/offers", data);

export const pauseOffre = (id) => request("PUT", `/offers/${id}/pause`);

export const supprimerOffre = (id) => request("DELETE", `/offers/${id}`);

// ─── CANDIDATURES ───────────────────────────────────────────────────────────

// Postuler (FormData car CV obligatoire en fichier)
// formData doit contenir : offer_id, cv (fichier PDF), motivation (optionnel)
export const postuler = async (formData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Erreur");
  return json;
};

export const mesCandidatures = () => request("GET", "/applications/my");

export const candidaturesRecues = () =>
  request("GET", "/applications/received");

export const changerStatut = (id, statut, note = "") =>
  request("PUT", `/applications/${id}/status`, {
    status: statut,
    internal_note: note,
  });

export const retirerCandidature = (id) =>
  request("DELETE", `/applications/${id}`);

// ─── PROFIL ─────────────────────────────────────────────────────────────────

export const mettreAJourProfil = (data) => request("PUT", "/profile", data);

// Upload CV (FormData car fichier)
export const uploaderCV = async (fichierCv) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("cv", fichierCv);

  const response = await fetch(`${BASE_URL}/profile/cv`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Erreur");
  return json;
};

// ─── FAVORIS ────────────────────────────────────────────────────────────────

export const getFavoris = () => request("GET", "/saved-offers");

export const ajouterFavori = (offreId) =>
  request("POST", "/saved-offers", { offer_id: offreId });

export const supprimerFavori = (offreId) =>
  request("DELETE", `/saved-offers/${offreId}`);

// ─── ADMIN ──────────────────────────────────────────────────────────────────

export const getStats = () => request("GET", "/admin/stats");

export const getEntreprisesEnAttente = () =>
  request("GET", "/admin/companies/pending");

export const validerEntreprise = (id) =>
  request("PUT", `/admin/companies/${id}/validate`);

export const rejeterEntreprise = (id) =>
  request("PUT", `/admin/companies/${id}/reject`);

export const supprimerOffreAdmin = (id) =>
  request("DELETE", `/admin/offers/${id}`);

import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardEtudiant from "./pages/DashboardEtudiant";
import DashboardRecruteur from "./pages/DashboardRecruteur";
import DashboardAdmin from "./pages/DashboardAdmin";
import ListeOffres from "./pages/ListeOffres";
import DetailOffre from "./pages/DetailOffre";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/connexion" element={<AuthPage />} />
        <Route path="/inscription" element={<AuthPage />} />
        <Route path="/dashboard-etudiant" element={<DashboardEtudiant />} />
        <Route path="/dashboard-recruteur" element={<DashboardRecruteur />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/offres" element={<ListeOffres />} />
        <Route path="/offres/:id" element={<DetailOffre />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

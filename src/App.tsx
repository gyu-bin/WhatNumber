import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { GuideListPage } from './pages/GuideListPage';
import { GuideDetailPage } from './pages/GuideDetailPage';
import { NumberPage } from './pages/NumberPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/n/:id" element={<NumberPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/guide" element={<GuideListPage />} />
      <Route path="/guide/:slug" element={<GuideDetailPage />} />
    </Routes>
  );
}

export default App;

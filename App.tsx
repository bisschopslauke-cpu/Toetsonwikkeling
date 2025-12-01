
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { GeneratorPage } from './pages/Generator';
import { GradingAssistantPage } from './pages/GradingAssistant';
import { AboutPage, FaqPage, ContactPage } from './pages/Static';
import { LanguageProvider } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const navigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <GeneratorPage />;
      case 'grading': return <GradingAssistantPage />;
      case 'about': return <AboutPage />;
      case 'faq': return <FaqPage />;
      case 'contact': return <ContactPage />;
      case 'privacy': return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Privacy info...</p>
        </div>
      );
      case 'terms': return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
           <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
           <p className="text-gray-600">Terms info...</p>
        </div>
      );
      default: return <GeneratorPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] dark:bg-dark-bg transition-colors duration-300 relative">
      <Navbar onNavigate={navigate} currentPage={currentPage} />
      
      <main className="flex-grow pt-8 pb-12 relative">
        {renderPage()}
      </main>

      <footer className="bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-white/5 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">
            &copy; {new Date().getFullYear()} Radboud Universiteit / Medimind B.V.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <button onClick={() => navigate('privacy')} className="hover:text-primary transition-colors">Privacy</button>
            <button onClick={() => navigate('terms')} className="hover:text-primary transition-colors">Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;

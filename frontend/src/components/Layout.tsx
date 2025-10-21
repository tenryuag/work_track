import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogOut, User, Globe } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = () => {
    if (user?.role === 'ADMIN') return t('admin');
    if (user?.role === 'MANAGER') return t('manager');
    return t('operator');
  };

  const handleLanguageChange = (lang: 'ja' | 'en') => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">{t('appName')}</h1>
              <span className="ml-3 text-sm text-gray-500">{t('appSubtitle')}</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  >
                    <Globe className="h-4 w-4" />
                    <span>{language === 'ja' ? '日本語' : 'English'}</span>
                  </button>

                  {showLangMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowLangMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        <button
                          onClick={() => handleLanguageChange('ja')}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition ${
                            language === 'ja' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {t('japanese')}
                        </button>
                        <button
                          onClick={() => handleLanguageChange('en')}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition ${
                            language === 'en' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {t('english')}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
                  <User className="h-5 w-5 text-gray-600" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{getRoleLabel()}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

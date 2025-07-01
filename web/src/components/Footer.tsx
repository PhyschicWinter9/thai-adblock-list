import { ArrowUp, ExternalLink, Github, Heart, Shield } from 'lucide-react';
import React from 'react';
import { useI18n } from '../hooks/useI18n';

const Footer: React.FC = () => {
  const { t } = useI18n();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-16 relative overflow-hidden transition-all duration-500">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <Shield className="h-8 w-8 text-blue-400" />
                <div className="absolute inset-0 bg-blue-400 opacity-20 blur-sm rounded-full"></div>
              </div>
              <span className="text-xl font-bold">Thai Adblock List</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex items-center space-x-2 text-gray-400">
              <Heart className="h-4 w-4 text-red-400" />
              <span className="text-sm">
                {t('footer.madeWith')}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">{t('footer.links')}</h3>
            <ul className="space-y-3">
              {['home', 'features', 'contribute', 'download'].map((section) => (
                <li key={section}>
                  <button
                    onClick={() => {
                      const element = document.getElementById(section);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 block"
                  >
                    {t(`nav.${section}`)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">{t('footer.community')}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com/PhyschicWinter9/thai-adblock-list"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-all duration-300 flex items-center space-x-2 group"
                >
                  <span>{t('footer.github')}</span>
                  <ExternalLink className="h-3 w-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/PhyschicWinter9/thai-adblock-list/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-all duration-300 flex items-center space-x-2 group"
                >
                  <span>{t('footer.issues')}</span>
                  <ExternalLink className="h-3 w-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/PhyschicWinter9/thai-adblock-list/pulls"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-all duration-300 flex items-center space-x-2 group"
                >
                  <span>{t('footer.contribute')}</span>
                  <ExternalLink className="h-3 w-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 Thai Adblock List.
          </p>
          
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/PhyschicWinter9/thai-adblock-list"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-all duration-300 flex items-center space-x-2 group"
            >
              <Github className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-sm">View Source</span>
            </a>
            
            <button
              onClick={scrollToTop}
              className="bg-gray-800 hover:bg-gray-700 p-2 rounded-xl transition-all duration-300 hover:scale-105"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
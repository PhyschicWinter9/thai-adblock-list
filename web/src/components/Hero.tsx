import { ArrowRight, Github, RefreshCw, Sparkles, Users, Zap } from 'lucide-react';
import React from 'react';
import { useI18n } from '../hooks/useI18n';

const Hero: React.FC = () => {
  const { t } = useI18n();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 py-20 lg:py-32 overflow-hidden transition-all duration-500">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 dark:bg-teal-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 dark:bg-purple-400/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-blue-200 dark:border-blue-800">
            <Sparkles className="h-4 w-4" />
            <span>Open Source Project</span>
          </div>

          {/* Main Content */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 dark:from-blue-400 dark:via-purple-400 dark:to-teal-400 bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto font-medium">
            {t('hero.subtitle')}
          </p>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <button
              onClick={() => scrollToSection('download')}
              className="group bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl dark:shadow-blue-500/25 flex items-center justify-center space-x-2"
            >
              <span>{t('hero.getStarted')}</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <a
              href="https://github.com/PhyschicWinter9/thai-adblock-list"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gray-800 dark:bg-gray-700 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-900 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl dark:shadow-gray-700/25 flex items-center justify-center space-x-2"
            >
              <Github className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>{t('hero.viewGitHub')}</span>
            </a>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Users,
                title: t('hero.features.community.title'),
                desc: t('hero.features.community.desc'),
                color: 'blue',
                gradient: 'from-blue-500 to-blue-600'
              },
              {
                icon: RefreshCw,
                title: t('hero.features.updated.title'),
                desc: t('hero.features.updated.desc'),
                color: 'teal',
                gradient: 'from-teal-500 to-teal-600'
              },
              {
                icon: Zap,
                title: t('hero.features.compatible.title'),
                desc: t('hero.features.compatible.desc'),
                color: 'orange',
                gradient: 'from-orange-500 to-orange-600'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl dark:shadow-gray-900/20 transition-all duration-500 transform hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
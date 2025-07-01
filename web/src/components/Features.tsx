import { FileText, Globe, RefreshCw, Shield, Users } from 'lucide-react';
import React from 'react';
import { useI18n } from '../hooks/useI18n';

const Features: React.FC = () => {
  const { t } = useI18n();

  const technicalDetails = [
    {
      icon: FileText,
      title: t('features.technical.filterFormat.title'),
      description: t('features.technical.filterFormat.description'),
      details: t('features.technical.filterFormat.details')
    },
    {
      icon: Globe,
      title: t('features.technical.targetWebsites.title'),
      description: t('features.technical.targetWebsites.description'),
      details: t('features.technical.targetWebsites.details')
    },
    {
      icon: RefreshCw,
      title: t('features.technical.updateFrequency.title'),
      description: t('features.technical.updateFrequency.description'),
      details: t('features.technical.updateFrequency.details')
    },
    {
      icon: Users,
      title: t('features.technical.maintenance.title'),
      description: t('features.technical.maintenance.description'),
      details: t('features.technical.maintenance.details')
    }
  ];

  const compatibility = [
    {
      name: 'uBlock Origin',
      description: t('features.compatibility.ublock.description'),
      status: t('features.compatibility.ublock.status')
    },
    {
      name: 'Adblock Plus',
      description: t('features.compatibility.adblockplus.description'),
      status: t('features.compatibility.adblockplus.status')
    },
    {
      name: 'AdGuard',
      description: t('features.compatibility.adguard.description'),
      status: t('features.compatibility.adguard.status')
    },
    {
      name: t('features.compatibility.others.name'),
      description: t('features.compatibility.others.description'),
      status: t('features.compatibility.others.status')
    }
  ];

  return (
     <section id="features" className="py-20 bg-white dark:bg-gray-800 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200 dark:border-blue-800">
            <Shield className="h-4 w-4" />
            <span>{t('features.badge')}</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('features.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t('features.description')}
          </p>
        </div>

        {/* Technical Details */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {technicalDetails.map((detail, index) => {
            const Icon = detail.icon;
            
            return (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {detail.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                  {detail.description}
                </p>
                
                <div className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                  {detail.details}
                </div>
              </div>
            );
          })}
        </div>

        {/* Compatibility Section */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 rounded-3xl p-12 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('features.compatibility.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('features.compatibility.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {compatibility.map((app, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    {app.name}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    app.status === t('features.compatibility.status.fullSupport')
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {app.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
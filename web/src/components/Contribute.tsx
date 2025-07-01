import {
  AlertTriangle,
  ArrowUpRight,
  GitPullRequest,
  MessageSquare,
} from "lucide-react";
import React from "react";
import { useI18n } from "../hooks/useI18n";

const Contribute: React.FC = () => {
  const { t } = useI18n();

  const contributionOptions = [
    {
      icon: MessageSquare,
      title: t("contribute.request.title"),
      description: t("contribute.request.desc"),
      action: t("contribute.request.action"),
      link: "https://github.com/PhyschicWinter9/thai-adblock-list/issues/new?template=site-request.md",
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "from-blue-600 to-blue-700",
    },
    {
      icon: GitPullRequest,
      title: t("contribute.pr.title"),
      description: t("contribute.pr.desc"),
      action: t("contribute.pr.action"),
      link: "https://github.com/PhyschicWinter9/thai-adblock-list/pulls",
      gradient: "from-emerald-500 to-emerald-600",
      hoverGradient: "from-emerald-600 to-emerald-700",
    },
    {
      icon: AlertTriangle,
      title: t("contribute.issue.title"),
      description: t("contribute.issue.desc"),
      action: t("contribute.issue.action"),
      link: "https://github.com/PhyschicWinter9/thai-adblock-list/issues/new?template=bug-report.md",
      gradient: "from-red-500 to-red-600",
      hoverGradient: "from-red-600 to-red-700",
    },
  ];

  return (
    <section
      id="contribute"
      className="py-20 bg-white dark:bg-gray-800 transition-all duration-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t("contribute.title")}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t("contribute.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {contributionOptions.map((option, index) => {
            const Icon = option.icon;

            return (
              <div
                key={index}
                className="group bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg hover:shadow-2xl dark:shadow-gray-900/20 transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 relative overflow-hidden"
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                ></div>

                <div className="relative">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${option.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {option.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-8 text-center leading-relaxed">
                    {option.description}
                  </p>

                  <a
                    href={option.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group/btn w-full bg-gradient-to-r ${option.gradient} hover:${option.hoverGradient} text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2`}
                  >
                    <span>{option.action}</span>
                    <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950/30 dark:to-teal-950/30 rounded-3xl p-8 border border-blue-200 dark:border-blue-800">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t("community.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              {t("community.description")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                🚀 {t("community.badges.fastResponse")}
              </span>
              <span className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                🤝 {t("community.badges.friendlyCommunity")}
              </span>
              <span className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                📚 {t("community.badges.learningWelcome")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contribute;

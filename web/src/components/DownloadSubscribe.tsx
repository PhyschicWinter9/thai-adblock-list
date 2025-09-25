import {
  Calendar,
  Check,
  Copy,
  ExternalLink,
  FileText,
  Hash,
  Loader2,
  Shield,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useI18n } from "../hooks/useI18n";
import type { FilterListMetadata, FilterProvider } from "../types/filterList";

const DownloadSubscribe: React.FC = () => {
  const { t } = useI18n();
  const [copiedUrl, setCopiedUrl] = useState<string>("");

  const rawListUrlABP =
    "https://raw.githubusercontent.com/PhyschicWinter9/thai-adblock-list/main/subscription/thai-adblock-list-adblockplus.txt";
  const rawListUrluBlock =
    "https://raw.githubusercontent.com/PhyschicWinter9/thai-adblock-list/main/subscription/thai-adblock-list-ublockorigin.txt";
  const rawListUrlAdGuard =
    "https://raw.githubusercontent.com/PhyschicWinter9/thai-adblock-list/main/subscription/thai-adblock-list-adguard.txt";
  const title = "Thai-Adblock-List";
  
  const templateSubscribeUrl = (link: string, title: string) =>
    `https://subscribe.adblockplus.org/?location=${encodeURIComponent(link)}&title=${encodeURIComponent(title)}`;


  const [providers, setProviders] = useState<FilterProvider[]>([
    {
      id: "adblock-plus",
      name: "Adblock Plus",
      description: "Most popular ad blocker with easy one-click subscription",
      subscribeUrl: templateSubscribeUrl(rawListUrlABP, title),
      rawUrl: rawListUrlABP,
      icon: Shield,
      color: "red",
      gradient: "from-red-500 to-red-600",
      instructions: [
        "instructions.adblock-plus.steps.0",
        "instructions.adblock-plus.steps.1",
        "instructions.adblock-plus.steps.2",
        "instructions.adblock-plus.steps.3",
        "instructions.adblock-plus.steps.4",
      ],
      loading: true,
    },
    {
      id: "ublock-origin",
      name: "uBlock Origin",
      description: "Advanced ad blocker with powerful filtering capabilities",
      subscribeUrl: templateSubscribeUrl(rawListUrluBlock, title),
      rawUrl: rawListUrluBlock,
      icon: Shield,
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
      instructions: [
        "instructions.ublock-origin.steps.0",
        "instructions.ublock-origin.steps.1",
        "instructions.ublock-origin.steps.2",
        "instructions.ublock-origin.steps.3",
        "instructions.ublock-origin.steps.4",
        "instructions.ublock-origin.steps.5",
      ],
      loading: true,
    },
    {
      id: "adguard",
      name: "AdGuard",
      description: "Comprehensive ad blocking with privacy protection",
      subscribeUrl: templateSubscribeUrl(rawListUrlAdGuard, title),
      rawUrl: rawListUrlAdGuard,
      icon: Shield,
      color: "emerald",
      gradient: "from-emerald-500 to-emerald-600",
      instructions: [
        "instructions.adguard.steps.0",
        "instructions.adguard.steps.1",
        "instructions.adguard.steps.2",
        "instructions.adguard.steps.3",
        "instructions.adguard.steps.4",
        "instructions.adguard.steps.5",
      ],
      loading: true,
    },
  ]);

  // Function to parse filter list metadata
  const parseFilterListMetadata = (content: string): FilterListMetadata => {
    const lines = content.split("\n");
    const metadata: Partial<FilterListMetadata> = {};
    let ruleCount = 0;

    // Extract metadata from comments
    for (const line of lines) {
      const trimmedLine = line.trim();

      // Parse metadata from comment lines
      if (trimmedLine.startsWith("!")) {
        const metaMatch = trimmedLine.match(/!\s*([^:]+):\s*(.+)/);
        if (metaMatch) {
          const key = metaMatch[1].toLowerCase().trim();
          const value = metaMatch[2].trim();

          switch (key) {
            case "version":
              metadata.version = value;
              break;
            case "title":
              metadata.title = value;
              break;
            case "last modified":
              metadata.lastModified = value;
              break;
            case "expires":
              metadata.expires = value;
              break;
            case "homepage":
              metadata.homepage = value;
              break;
            case "description":
              metadata.description = value;
              break;
          }
        }
      }
      // Count rules (non-comment, non-empty lines)
      else if (
        trimmedLine &&
        !trimmedLine.startsWith("!") &&
        !trimmedLine.startsWith("[")
      ) {
        ruleCount++;
      }
    }

    // Calculate file size
    const fileSize = new Blob([content]).size;
    const fileSizeKB = (fileSize / 1024).toFixed(1);

    return {
      version: metadata.version || "Unknown",
      title: metadata.title || "Unknown",
      lastModified: metadata.lastModified || "Unknown",
      expires: metadata.expires || "Unknown",
      homepage: metadata.homepage || "",
      description: metadata.description || "",
      ruleCount,
      fileSize: `${fileSizeKB} KB`,
      fileSizeBytes: fileSize,
    };
  };

  // Fetch filter list data
  const fetchFilterListData = async (
    url: string
  ): Promise<FilterListMetadata> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const content = await response.text();
      return parseFilterListMetadata(content);
    } catch (error) {
      console.error("Error fetching filter list:", error);
      throw error;
    }
  };

  // Update provider metadata
  const updateProviderMetadata = (
    providerId: string,
    metadata: FilterListMetadata
  ) => {
    setProviders((prevProviders) =>
      prevProviders.map((provider) =>
        provider.id === providerId
          ? { ...provider, metadata, loading: false, error: undefined }
          : provider
      )
    );
  };

  // Update provider error
  const updateProviderError = (providerId: string, error: string) => {
    setProviders((prevProviders) =>
      prevProviders.map((provider) =>
        provider.id === providerId
          ? { ...provider, loading: false, error }
          : provider
      )
    );
  };

  // Load all filter list data
  useEffect(() => {
    const loadFilterListData = async () => {
      const promises = providers.map(async (provider) => {
        try {
          const metadata = await fetchFilterListData(provider.rawUrl);
          updateProviderMetadata(provider.id, metadata);
        } catch (error) {
          updateProviderError(
            provider.id,
            error instanceof Error ? error.message : "Failed to load"
          );
        }
      });

      await Promise.all(promises);
    };

    loadFilterListData();
  }, []);

  const handleCopyUrl = async (url: string, providerId: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(providerId);
      setTimeout(() => setCopiedUrl(""), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  // Format date from DD-MM-YYYY to readable format
  const formatDate = (dateStr: string): string => {
    if (!dateStr || dateStr === "Unknown") return dateStr;
    try {
      const [day, month, year] = dateStr.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <section
      id="download"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 transition-all duration-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200 dark:border-blue-800">
            <Shield className="h-4 w-4" />
            <span>{t("download.badgeTitle")}</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t("download.title")}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t("download.description")}
          </p>
        </div>

        {/* Provider Cards */}
        <div className="space-y-8">
          {providers.map((provider) => {
            const Icon = provider.icon;
            const isCopied = copiedUrl === provider.id;
            const metadata = provider.metadata;

            return (
              <div
                key={provider.id}
                className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl dark:shadow-gray-900/20 transition-all duration-500 border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${provider.gradient} p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {provider.name}
                        </h3>
                        <p className="text-white/80">
                          {t("adblockProvider." + provider.id + ".description")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-white/80">
                      {provider.loading ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Loading...</span>
                        </div>
                      ) : provider.error ? (
                        <div className="text-sm text-red-200">
                          Error loading data
                        </div>
                      ) : metadata ? (
                        <>
                          <div className="text-sm">
                            {t("download.version")} {metadata.version}
                          </div>
                          <div className="text-xs">
                            {metadata.ruleCount.toLocaleString()} rules
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Subscription Section */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                          <Zap className="h-5 w-5 text-orange-500" />
                          <span>
                            {t(
                              "adblockProvider." +
                                provider.id +
                                ".oneClick.title"
                            )}
                          </span>
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {t(
                            "adblockProvider." + provider.id + ".oneClick.desc"
                          )}
                        </p>
                        <a
                          href={provider.subscribeUrl}
                          rel="nofollow"
                          className={`w-full bg-gradient-to-r ${provider.gradient} text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 no-underline`}
                        >
                          <ExternalLink className="h-5 w-5" />
                          <span>
                            {t(
                              "adblockProvider." +
                                provider.id +
                                ".oneClick.btn-text"
                            )}
                          </span>
                        </a>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-2 mb-2">
                            <Hash className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Rules
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {provider.loading ? (
                              <Loader2 className="h-6 w-6 animate-spin" />
                            ) : provider.error ? (
                              <span className="text-sm text-red-500">
                                Error
                              </span>
                            ) : metadata ? (
                              metadata.ruleCount.toLocaleString()
                            ) : (
                              "---"
                            )}
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-2 mb-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {t("download.size")}
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {provider.loading ? (
                              <Loader2 className="h-6 w-6 animate-spin" />
                            ) : provider.error ? (
                              <span className="text-sm text-red-500">
                                Error
                              </span>
                            ) : metadata ? (
                              metadata.fileSize
                            ) : (
                              "---"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Raw URL Section */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <span>{t("download.rawFilter")}</span>
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {t("download.rawFilterDesc")}
                        </p>

                        {/* URL Display */}
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 mb-4">
                          <div className="flex items-center justify-between">
                            <code className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1 mr-3 font-mono">
                              {provider.rawUrl}
                            </code>
                            <button
                              onClick={() =>
                                handleCopyUrl(provider.rawUrl, provider.id)
                              }
                              className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 flex-shrink-0"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                  <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                    {t("download.copied")}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {t("download.copy")}
                                  </span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Last Updated */}
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {t("download.lastUpdate")}:{" "}
                            {provider.loading
                              ? "Loading..."
                              : provider.error
                              ? "Error"
                              : metadata
                              ? formatDate(metadata.lastModified)
                              : "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Future Providers Notice */}
        <div className="mt-16 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-3xl p-8 border border-purple-200 dark:border-purple-800">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t("adblockProvider.others.moreProviders")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              {t("adblockProvider.others.description")}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                🔜 Brave Browser
              </span>
              <span className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                🔜 Pi-hole
              </span>
              <span className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                🔜 AdAway
              </span>
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("instructions.manual.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("instructions.manual.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <div
                    className={`w-8 h-8 bg-gradient-to-r ${provider.gradient} rounded-lg flex items-center justify-center`}
                  >
                    <provider.icon className="h-4 w-4 text-white" />
                  </div>
                  <span>{provider.name}</span>
                </h4>
                <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-3">
                  {provider.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span
                        className={`bg-gradient-to-r ${provider.gradient} text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0`}
                      >
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{t(instruction)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSubscribe;

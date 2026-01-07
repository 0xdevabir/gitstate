'use client';

import { useState } from 'react';
import { GitHubStats, StatsCardConfig, EmbedCode } from '@/types/github';
import UsernameInput from '@/components/UsernameInput';
import ThemeSelector from '@/components/ThemeSelector';
import DisplayOptions from '@/components/DisplayOptions';
import CardPreview from '@/components/CardPreview';
import EmbedCodeDisplay from '@/components/EmbedCodeDisplay';
import { createCardConfig, generateEmbedCodes } from '@/lib/card-generator';
import { Github } from 'lucide-react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [config, setConfig] = useState<StatsCardConfig>(createCardConfig(''));
  const [embedCode, setEmbedCode] = useState<EmbedCode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUsernameSubmit = async (inputUsername: string) => {
    setUsername(inputUsername);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/stats/${inputUsername}`);
      if (!response.ok) {
        throw new Error(`User not found or API error: ${response.status}`);
      }

      const data = await response.json();
      const { stats, user } = data;
      setStats(stats);

      // Create config and embed codes
      const newConfig = createCardConfig(inputUsername, 'dark');
      setConfig(newConfig);
      const codes = generateEmbedCodes(
        inputUsername,
        stats,
        newConfig,
        typeof window !== 'undefined' ? window.location.origin : '',
        user
      );
      setEmbedCode(codes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user stats');
      setStats(null);
      setEmbedCode(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = (theme: string) => {
    const newConfig = { ...config, theme: theme as any };
    setConfig(newConfig);
    if (stats) {
      const codes = generateEmbedCodes(
        username,
        stats,
        newConfig,
        typeof window !== 'undefined' ? window.location.origin : '',
        (window as any).__userData
      );
      setEmbedCode(codes);
    }
  };

  const handleOptionChange = (option: string, value: boolean) => {
    const newConfig = {
      ...config,
      displayOptions: {
        ...config.displayOptions,
        [option]: value,
      },
    };
    setConfig(newConfig);
    if (stats) {
      const codes = generateEmbedCodes(
        username,
        stats,
        newConfig,
        typeof window !== 'undefined' ? window.location.origin : '',
        (window as any).__userData
      );
      setEmbedCode(codes);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Github className="w-8 h-8 text-blue-500" />
          <h1 className="text-4xl font-bold text-white">GitHub Insights Generator</h1>
        </div>
        <p className="text-gray-400">
          Generate beautiful statistics cards for your GitHub profile. Customize the theme, select which
          stats to display, and get ready-to-use embed code.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Configuration */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 space-y-6 sticky top-8">
            <h2 className="text-xl font-bold text-white">Configuration</h2>

            {/* Username Input */}
            <div>
              <h3 className="text-sm font-semibold text-gray-200 mb-3">GitHub Username</h3>
              <UsernameInput onSubmit={handleUsernameSubmit} isLoading={isLoading} />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Theme Selector */}
            {stats && (
              <>
                <ThemeSelector selectedTheme={config.theme} onThemeChange={handleThemeChange} />

                {/* Display Options */}
                <DisplayOptions
                  options={config.displayOptions}
                  onOptionChange={handleOptionChange}
                />
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Preview and Embed Code */}
        <div className="lg:col-span-2 space-y-8">
          {/* Preview */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Preview</h2>
            <CardPreview username={username} stats={stats} config={config} isLoading={isLoading} />
          </div>

          {/* Embed Code */}
          {embedCode && (
            <div>
              <EmbedCodeDisplay embedCode={embedCode} />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-white mb-2">Features</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>✓ Real-time GitHub stats</li>
              <li>✓ Multiple themes</li>
              <li>✓ Customizable display options</li>
              <li>✓ One-click copy embed code</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Supported Formats</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>✓ SVG (Recommended)</li>
              <li>✓ HTML</li>
              <li>✓ Markdown</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Quick Links</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  Report Issue
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-center text-gray-500 text-sm">
          © 2026 GitHub Insights Generator. Built with ❤️ by Abir
        </p>
      </div>
    </main>
  );
}

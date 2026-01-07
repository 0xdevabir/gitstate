'use client';

import { GitHubStats, StatsCardConfig } from '@/types/github';

interface CardPreviewProps {
  username: string;
  stats: GitHubStats | null;
  config: StatsCardConfig;
  isLoading?: boolean;
}

export default function CardPreview({ username, stats, config, isLoading }: CardPreviewProps) {
  if (!stats && !isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600">
        <p className="text-gray-400 text-center">
          Enter a GitHub username and configure options to see your stats card preview
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg">
        <div className="animate-pulse">
          <p className="text-gray-400">Loading stats...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // Build URL with all display options as query parameters
  const params = new URLSearchParams({
    theme: config.theme,
    showRepositories: String(config.displayOptions.showRepositories),
    showFollowers: String(config.displayOptions.showFollowers),
    showStars: String(config.displayOptions.showStars),
    showLanguages: String(config.displayOptions.showLanguages),
    showJoinDate: String(config.displayOptions.showJoinDate),
    showLocation: String(config.displayOptions.showLocation),
    showName: String(config.displayOptions.showName),
    showContributions: String(config.displayOptions.showContributions),
    showCharts: String(config.displayOptions.showCharts),
    showStreak: String(config.displayOptions.showStreak),
    showLanguageChart: String(config.displayOptions.showLanguageChart),
  });

  return (
    <div className="bg-gray-800 rounded-lg p-6 overflow-hidden border border-gray-700">
      <div className="flex flex-col items-center">
        <img
          key={params.toString()} // Force reload on parameter change
          src={`/api/insights/${username}?${params.toString()}`}
          alt={`${username} GitHub stats`}
          className="w-full max-w-4xl rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}

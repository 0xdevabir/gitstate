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

  return (
    <div className="bg-gray-800 rounded-lg p-6 overflow-hidden border border-gray-700">
      <div className="flex flex-col items-center">
        <img
          src={`/api/insights/${username}?theme=${config.theme}`}
          alt={`${username} GitHub stats`}
          className="w-full max-w-2xl rounded-lg"
        />
      </div>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-3 bg-gray-700 rounded-lg">
          <p className="text-xs text-gray-400">Total Repos</p>
          <p className="text-xl font-bold text-blue-400">{stats.totalRepos}</p>
        </div>
        <div className="p-3 bg-gray-700 rounded-lg">
          <p className="text-xs text-gray-400">Total Stars</p>
          <p className="text-xl font-bold text-blue-400">{stats.totalStars}</p>
        </div>
        <div className="p-3 bg-gray-700 rounded-lg">
          <p className="text-xs text-gray-400">Followers</p>
          <p className="text-xl font-bold text-blue-400">{stats.totalFollowers}</p>
        </div>
        <div className="p-3 bg-gray-700 rounded-lg">
          <p className="text-xs text-gray-400">Gists</p>
          <p className="text-xl font-bold text-blue-400">{stats.totalGists}</p>
        </div>
        <div className="p-3 bg-gray-700 rounded-lg">
          <p className="text-xs text-gray-400">Forks</p>
          <p className="text-xl font-bold text-blue-400">{stats.totalForks}</p>
        </div>
        <div className="p-3 bg-gray-700 rounded-lg">
          <p className="text-xs text-gray-400">Contributions</p>
          <p className="text-xl font-bold text-blue-400">{stats.contributions}</p>
        </div>
      </div>
      {stats.topLanguages && Object.keys(stats.topLanguages).length > 0 && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <p className="text-sm font-semibold text-gray-300 mb-2">Top Languages</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.topLanguages)
              .slice(0, 5)
              .map(([lang, count]) => (
                <span key={lang} className="text-xs bg-blue-600 px-2 py-1 rounded">
                  {lang}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

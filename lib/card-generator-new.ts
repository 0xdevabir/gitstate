import { GitHubStats, StatsCardConfig, EmbedCode } from '@/types/github';
import { generateAdvancedStatsSVG } from './advanced-card-generator';

export function createCardConfig(
  username: string,
  theme: string = 'dark',
  displayOptions: Record<string, boolean> = {}
): StatsCardConfig {
  return {
    username,
    theme: (theme as any) || 'dark',
    displayOptions: {
      showRepositories: displayOptions.showRepositories !== false,
      showFollowers: displayOptions.showFollowers !== false,
      showStars: displayOptions.showStars !== false,
      showLanguages: displayOptions.showLanguages !== false,
      showJoinDate: displayOptions.showJoinDate !== false,
      showLocation: displayOptions.showLocation !== false,
      showName: displayOptions.showName !== false,
      showContributions: displayOptions.showContributions !== false,
      showCharts: displayOptions.showCharts !== false,
      showStreak: displayOptions.showStreak !== false,
      showLanguageChart: displayOptions.showLanguageChart !== false,
    },
  };
}

export function generateEmbedCodes(
  username: string,
  stats: GitHubStats,
  config: StatsCardConfig,
  apiBaseUrl: string,
  userData?: any
): EmbedCode {
  const svgUrl = `${apiBaseUrl}/api/insights/${username}?theme=${config.theme}`;

  return {
    markdown: `<div align="center">\n  <img src="${svgUrl}" alt="${username} GitHub Stats" />\n</div>`,
    html: `<div align="center">\n  <img src="${svgUrl}" alt="${username} GitHub Stats" width="1000" />\n</div>`,
    svg: generateAdvancedStatsSVG(username, stats, config, userData),
  };
}

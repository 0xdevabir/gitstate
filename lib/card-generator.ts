import { GitHubStats, StatsCardConfig, EmbedCode } from '@/types/github';

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function getThemeColors(theme: string) {
  const themes: Record<string, Record<string, string>> = {
    dark: {
      bg: '#0d1117',
      card: '#161b22',
      text: '#c9d1d9',
      accent: '#30363d',
      highlight: '#58a6ff',
      border: '#30363d',
    },
    light: {
      bg: '#ffffff',
      card: '#f6f8fa',
      text: '#24292f',
      accent: '#d0d7de',
      highlight: '#0969da',
      border: '#d0d7de',
    },
    neon: {
      bg: '#0a0e27',
      card: '#1a1f3a',
      text: '#00ff88',
      accent: '#ff006e',
      highlight: '#00d9ff',
      border: '#ff006e',
    },
    ocean: {
      bg: '#0c1e3a',
      card: '#1a3a52',
      text: '#a8d8f0',
      accent: '#2a6a8a',
      highlight: '#4db8ff',
      border: '#4db8ff',
    },
    tokyo: {
      bg: '#1a1b26',
      card: '#292e42',
      text: '#9da5b4',
      accent: '#3b4261',
      highlight: '#7aa2f7',
      border: '#3b4261',
    },
    dracula: {
      bg: '#282a36',
      card: '#21222c',
      text: '#f8f8f2',
      accent: '#44475a',
      highlight: '#ff79c6',
      border: '#44475a',
    },
  };
  return themes[theme] || themes.dark;
}

export function generateStatsSVG(
  username: string,
  stats: GitHubStats,
  config: StatsCardConfig,
  userData?: any
): string {
  const colors = getThemeColors(config.theme);
  const width = 800;
  const height = 600;

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

  // Background
  svg += `<rect width="${width}" height="${height}" fill="${colors.bg}"/>`;

  // Main card background
  svg += `<rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="${colors.card}" rx="12" stroke="${colors.border}" stroke-width="1"/>`;

  let yOffset = 40;

  // Header section - Username and name
  if (userData?.name || config.displayOptions.showName) {
    svg += `<text x="40" y="${yOffset}" font-size="32" font-weight="bold" fill="${colors.highlight}" font-family="Arial, sans-serif">${username}</text>`;
    yOffset += 35;
    
    if (userData?.name) {
      svg += `<text x="40" y="${yOffset}" font-size="14" fill="${colors.text}" font-family="Arial, sans-serif">${userData.name}</text>`;
      yOffset += 25;
    }
  }

  // Summary stats row
  const statWidth = (width - 80) / 3;
  const statsData = [
    { icon: '📊', label: 'Repos', value: formatNumber(stats.totalRepos), show: config.displayOptions.showRepositories },
    { icon: '⭐', label: 'Stars', value: formatNumber(stats.totalStars), show: config.displayOptions.showStars },
    { icon: '👥', label: 'Followers', value: formatNumber(stats.totalFollowers), show: config.displayOptions.showFollowers },
  ];

  let xOffset = 40;
  statsData.forEach((stat) => {
    if (stat.show) {
      svg += `<text x="${xOffset}" y="${yOffset}" font-size="12" fill="${colors.text}" font-family="Arial, sans-serif">${stat.label}</text>`;
      svg += `<text x="${xOffset}" y="${yOffset + 20}" font-size="24" font-weight="bold" fill="${colors.highlight}" font-family="Arial, sans-serif">${stat.value}</text>`;
      xOffset += statWidth;
    }
  });

  yOffset += 60;

  // Languages section
  if (config.displayOptions.showLanguages && Object.keys(stats.topLanguages).length > 0) {
    svg += `<text x="40" y="${yOffset}" font-size="16" font-weight="bold" fill="${colors.text}" font-family="Arial, sans-serif">Top Languages</text>`;
    yOffset += 25;

    const langs = Object.entries(stats.topLanguages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const langBoxWidth = (width - 80) / 5;
    let langX = 40;

    langs.forEach(([lang, count]) => {
      const percentage = (count / stats.totalRepos) * 100;
      svg += `<rect x="${langX}" y="${yOffset}" width="${langBoxWidth - 5}" height="50" fill="${colors.accent}" rx="6"/>`;
      svg += `<text x="${langX + 10}" y="${yOffset + 20}" font-size="12" font-weight="bold" fill="${colors.highlight}" font-family="Arial, sans-serif">${lang}</text>`;
      svg += `<text x="${langX + 10}" y="${yOffset + 38}" font-size="11" fill="${colors.text}" font-family="Arial, sans-serif">${percentage.toFixed(0)}%</text>`;
      langX += langBoxWidth;
    });

    yOffset += 70;
  }

  // Additional stats
  if (config.displayOptions.showContributions) {
    const additionalStats = [
      { label: 'Contributions', value: formatNumber(stats.contributions) },
      { label: 'Gists', value: formatNumber(stats.totalGists) },
      { label: 'Forks', value: formatNumber(stats.totalForks) },
    ];

    let statX = 40;
    const statBoxWidth = (width - 80) / 3;

    additionalStats.forEach((stat) => {
      svg += `<rect x="${statX}" y="${yOffset}" width="${statBoxWidth - 5}" height="60" fill="${colors.accent}" rx="6"/>`;
      svg += `<text x="${statX + 15}" y="${yOffset + 25}" font-size="11" fill="${colors.text}" font-family="Arial, sans-serif">${stat.label}</text>`;
      svg += `<text x="${statX + 15}" y="${yOffset + 45}" font-size="20" font-weight="bold" fill="${colors.highlight}" font-family="Arial, sans-serif">${stat.value}</text>`;
      statX += statBoxWidth;
    });

    yOffset += 80;
  }

  // Footer
  svg += `<text x="40" y="${height - 20}" font-size="11" fill="${colors.text}" font-family="Arial, sans-serif">Generated with GitHub Insights</text>`;

  svg += '</svg>';

  return svg;
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
    html: `<div align="center">\n  <img src="${svgUrl}" alt="${username} GitHub Stats" width="800" />\n</div>`,
    svg: generateStatsSVG(username, stats, config, userData),
  };
}

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
    },
  };
}

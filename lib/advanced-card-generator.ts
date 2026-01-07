import { GitHubStats, StatsCardConfig } from '@/types/github';

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
      cardLight: '#21262d',
      text: '#c9d1d9',
      textLight: '#8b949e',
      accent: '#30363d',
      highlight: '#58a6ff',
      border: '#30363d',
      borderGradient1: '#58a6ff',
      borderGradient2: '#3fb950',
      success: '#3fb950',
      warning: '#d29922',
      danger: '#f85149',
      orange: '#ff7b72',
      purple: '#bc8cff',
      yellow: '#f0c800',
    },
    light: {
      bg: '#ffffff',
      card: '#f6f8fa',
      cardLight: '#eaeef2',
      text: '#24292f',
      textLight: '#57606a',
      accent: '#d0d7de',
      highlight: '#0969da',
      border: '#d0d7de',
      borderGradient1: '#0969da',
      borderGradient2: '#1a7f37',
      success: '#1a7f37',
      warning: '#9e6a03',
      danger: '#d1242f',
      orange: '#d1242f',
      purple: '#8250df',
      yellow: '#bf8700',
    },
    neon: {
      bg: '#0a0e27',
      card: '#1a1f3a',
      cardLight: '#252d4d',
      text: '#00ff88',
      textLight: '#00cc66',
      accent: '#ff006e',
      highlight: '#00d9ff',
      border: '#ff006e',
      borderGradient1: '#00d9ff',
      borderGradient2: '#00ff88',
      success: '#00ff88',
      warning: '#ffaa00',
      danger: '#ff0055',
      orange: '#ff6600',
      purple: '#cc00ff',
      yellow: '#ffdd00',
    },
    ocean: {
      bg: '#0c1e3a',
      card: '#1a3a52',
      cardLight: '#244863',
      text: '#a8d8f0',
      textLight: '#7ab8d8',
      accent: '#2a6a8a',
      highlight: '#4db8ff',
      border: '#4db8ff',
      borderGradient1: '#4db8ff',
      borderGradient2: '#2dd4a4',
      success: '#2dd4a4',
      warning: '#ffa500',
      danger: '#ff6b6b',
      orange: '#ff8c42',
      purple: '#9b72ff',
      yellow: '#ffd700',
    },
    tokyo: {
      bg: '#1a1b26',
      card: '#292e42',
      cardLight: '#3e4451',
      text: '#9da5b4',
      textLight: '#7e8490',
      accent: '#3b4261',
      highlight: '#7aa2f7',
      border: '#3b4261',
      borderGradient1: '#7aa2f7',
      borderGradient2: '#9ece6a',
      success: '#9ece6a',
      warning: '#e0af68',
      danger: '#f7768e',
      orange: '#ff9e64',
      purple: '#bb9af7',
      yellow: '#e0af68',
    },
    dracula: {
      bg: '#282a36',
      card: '#21222c',
      cardLight: '#44475a',
      text: '#f8f8f2',
      textLight: '#bcc7d0',
      accent: '#44475a',
      highlight: '#ff79c6',
      border: '#44475a',
      borderGradient1: '#ff79c6',
      borderGradient2: '#50fa7b',
      success: '#50fa7b',
      warning: '#f1fa8c',
      danger: '#ff5555',
      orange: '#ffb86c',
      purple: '#bd93f9',
      yellow: '#f1fa8c',
    },
  };
  return themes[theme] || themes.dark;
}

function createPath(points: Array<[number, number]>, width: number): string {
  if (points.length === 0) return '';
  let path = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i][0]},${points[i][1]}`;
  }
  return path;
}

function generateLineChart(
  data: number[],
  width: number,
  height: number,
  color: string,
  colors: Record<string, string>
): string {
  if (data.length === 0) return '';

  const maxValue = Math.max(...data, 1);
  const minValue = Math.min(...data, 0);
  const range = maxValue - minValue || 1;
  const padding = 10;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points: Array<[number, number]> = data.map((value, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
    const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
    return [x, y];
  });

  const pathData = createPath(points, width);
  let svg = '';

  // Gradient area under line
  svg += `<defs><linearGradient id="grad-${Date.now()}" x1="0%" y1="0%" x2="0%" y2="100%">`;
  svg += `<stop offset="0%" style="stop-color:${color};stop-opacity:0.3" />`;
  svg += `<stop offset="100%" style="stop-color:${color};stop-opacity:0.05" />`;
  svg += `</linearGradient></defs>`;

  // Fill path
  let fillPath = pathData + ` L ${width - padding},${chartHeight + padding} L ${padding},${chartHeight + padding} Z`;
  svg += `<path d="${fillPath}" fill="url(#grad-${Date.now()})" />`;

  // Line
  svg += `<path d="${pathData}" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`;

  return svg;
}

function generateLanguageChart(
  languages: { [key: string]: number },
  width: number,
  colors: Record<string, string>
): string {
  const entries = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (entries.length === 0) return '';

  const total = entries.reduce((sum, [, count]) => sum + count, 0);
  const chartColors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
  ];

  let svg = '';
  let currentX = 0;

  entries.forEach(([lang, count], index) => {
    const percentage = (count / total) * 100;
    const barWidth = (width * percentage) / 100;

    svg += `<rect x="${currentX}" y="0" width="${barWidth}" height="12" fill="${chartColors[index]}" />`;
    currentX += barWidth;
  });

  return svg;
}

export function generateAdvancedStatsSVG(
  username: string,
  stats: GitHubStats,
  config: StatsCardConfig,
  userData?: any
): string {
  const colors = getThemeColors(config.theme);
  const width = 760;
  const height = 800;

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Gradient border definition
  svg += `<defs>
    <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.borderGradient1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colors.borderGradient2};stop-opacity:1" />
    </linearGradient>
    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.highlight};stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:${colors.highlight};stop-opacity:0.05" />
    </linearGradient>
  </defs>`;

  // Background
  svg += `<rect width="${width}" height="${height}" fill="${colors.bg}"/>`;

  // Main card with gradient border
  svg += `<rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="${colors.card}" rx="16" stroke="url(#borderGradient)" stroke-width="2"/>`;

  let yOffset = 50;

  // Header - Username and Name
  svg += `<text x="40" y="${yOffset}" font-size="32" font-weight="bold" fill="${colors.highlight}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">${username}</text>`;
  yOffset += 30;

  if (userData?.name && config.displayOptions.showName) {
    svg += `<text x="40" y="${yOffset}" font-size="14" fill="${colors.textLight}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">${userData.name}</text>`;
    yOffset += 35;
  } else {
    yOffset += 25;
  }

  // Top info bar
  const topInfo = [
    { icon: '🔥', text: `${formatNumber(stats.contributions)} contributions in the last year`, show: config.displayOptions.showContributions },
    { icon: '📚', text: `${formatNumber(stats.totalRepos)} public repositories`, show: config.displayOptions.showRepositories },
    { icon: '📅', text: `Joined GitHub ${stats.joinedDate.includes('years') ? stats.joinedDate : new Date(userData?.created_at).getFullYear() + ' years ago'}`, show: config.displayOptions.showJoinDate },
    { icon: '📍', text: userData?.location || 'Not specified', show: config.displayOptions.showLocation && userData?.location },
  ];

  topInfo.forEach((info) => {
    if (info.show) {
      svg += `<text x="40" y="${yOffset}" font-size="13" fill="${colors.text}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">${info.icon} ${info.text}</text>`;
      yOffset += 25;
    }
  });

  yOffset += 15;

  // Two-column layout
  const leftColX = 30;
  const rightColX = 390;
  const colWidth = 340;
  const sectionHeight = 200;

  // Left column - GitHub Stats
  svg += `<rect x="${leftColX}" y="${yOffset}" width="${colWidth}" height="${sectionHeight}" fill="${colors.cardLight}" rx="10"/>`;
  svg += `<text x="${leftColX + 15}" y="${yOffset + 25}" font-size="14" font-weight="bold" fill="${colors.highlight}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">⚡ GitHub Stats</text>`;

  const githubStats = [
    { icon: '⭐', label: 'Total Stars Earned', value: formatNumber(stats.totalStars) },
    { icon: '🔀', label: 'Commits (Last Year)', value: formatNumber(stats.contributions) },
    { icon: '🔀', label: 'Pull Requests (Last Year)', value: formatNumber(stats.pullRequests || 2) },
    { icon: '⭕', label: 'Issues (Last Year)', value: formatNumber(stats.issues || 1) },
    { icon: '🤝', label: 'Contributed To', value: formatNumber(stats.contributedTo || 10) },
  ];

  let statsY = yOffset + 50;
  githubStats.forEach((stat) => {
    svg += `<text x="${leftColX + 15}" y="${statsY}" font-size="11" fill="${colors.textLight}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">${stat.icon} ${stat.label}</text>`;
    svg += `<text x="${leftColX + colWidth - 15}" y="${statsY}" font-size="11" font-weight="bold" fill="${colors.text}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif" text-anchor="end">${stat.value}</text>`;
    statsY += 28;
  });

  // Rating badge (circular)
  const ratingX = leftColX + colWidth - 50;
  const ratingY = yOffset + sectionHeight - 50;
  svg += `<circle cx="${ratingX}" cy="${ratingY}" r="28" fill="${colors.accent}" stroke="${colors.highlight}" stroke-width="3"/>`;
  svg += `<text x="${ratingX}" y="${ratingY + 8}" font-size="24" font-weight="bold" fill="${colors.highlight}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif" text-anchor="middle">B</text>`;
  svg += `<text x="${ratingX}" y="${ratingY + 38}" font-size="9" fill="${colors.textLight}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif" text-anchor="middle">Rating</text>`;

  // Right column - Most Used Languages
  if (config.displayOptions.showLanguageChart && Object.keys(stats.topLanguages).length > 0) {
    svg += `<rect x="${rightColX}" y="${yOffset}" width="${colWidth}" height="${sectionHeight}" fill="${colors.cardLight}" rx="10"/>`;
    svg += `<text x="${rightColX + 15}" y="${yOffset + 25}" font-size="14" font-weight="bold" fill="${colors.highlight}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">📊 Most Used Languages</text>`;

    const langEntries = Object.entries(stats.topLanguages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
    const total = langEntries.reduce((sum, [, count]) => sum + count, 0);
    
    // Color bar at top
    const barY = yOffset + 35;
    const barHeight = 8;
    let barX = rightColX + 15;
    const barTotalWidth = colWidth - 30;
    
    const langColors: Record<string, string> = {
      'HTML': colors.orange,
      'TypeScript': colors.highlight,
      'JavaScript': colors.yellow,
      'CSS': colors.purple,
      'C++': '#f54281',
      'C': colors.textLight,
      'Python': '#3572A5',
      'Java': '#b07219',
      'Go': '#00ADD8',
      'Rust': '#dea584',
    };

    langEntries.forEach(([lang, count]) => {
      const percentage = (count / total) * 100;
      const segmentWidth = (barTotalWidth * percentage) / 100;
      const color = langColors[lang] || colors.highlight;
      svg += `<rect x="${barX}" y="${barY}" width="${segmentWidth}" height="${barHeight}" fill="${color}" rx="2"/>`;
      barX += segmentWidth;
    });

    // Language list
    let langY = yOffset + 60;
    langEntries.forEach(([lang, count]) => {
      const percentage = ((count / total) * 100).toFixed(1);
      const color = langColors[lang] || colors.highlight;
      
      svg += `<circle cx="${rightColX + 20}" cy="${langY - 4}" r="4" fill="${color}"/>`;
      svg += `<text x="${rightColX + 30}" y="${langY}" font-size="11" fill="${colors.text}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">${lang}</text>`;
      svg += `<text x="${rightColX + colWidth - 15}" y="${langY}" font-size="11" font-weight="bold" fill="${colors.text}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif" text-anchor="end">${percentage}%</text>`;
      langY += 22;
    });
  }

  yOffset += sectionHeight + 20;

  // Three-box stats layout
  if (config.displayOptions.showStreak) {
    const boxWidth = (width - 80) / 3;
    const boxHeight = 100;
    const boxSpacing = 10;

    // Total Contributions
    svg += `<rect x="${leftColX}" y="${yOffset}" width="${boxWidth - boxSpacing}" height="${boxHeight}" fill="${colors.cardLight}" rx="10"/>`;
    svg += `<text x="${leftColX + 15}" y="${yOffset + 35}" font-size="28" font-weight="bold" fill="${colors.highlight}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">✨</text>`;
    svg += `<text x="${leftColX + 50}" y="${yOffset + 35}" font-size="28" font-weight="bold" fill="${colors.highlight}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">${formatNumber(stats.contributions)}</text>`;
    svg += `<text x="${leftColX + 15}" y="${yOffset + 58}" font-size="12" fill="${colors.text}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">Total Contributions</text>`;
    svg += `<text x="${leftColX + 15}" y="${yOffset + 75}" font-size="9" fill="${colors.textLight}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">May 20, 2025 - Present</text>`;

    // Current Streak
    const box2X = leftColX + boxWidth;
    svg += `<rect x="${box2X}" y="${yOffset}" width="${boxWidth - boxSpacing}" height="${boxHeight}" fill="${colors.cardLight}" rx="10"/>`;
    
    // Circular progress for streak
    const circleX = box2X + boxWidth / 2 - 5;
    const circleY = yOffset + 35;
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const streakProgress = Math.min((stats.currentStreak || 10) / 30, 1);
    const dashOffset = circumference * (1 - streakProgress);
    
    svg += `<circle cx="${circleX}" cy="${circleY}" r="${radius}" fill="none" stroke="${colors.accent}" stroke-width="3"/>`;
    svg += `<circle cx="${circleX}" cy="${circleY}" r="${radius}" fill="none" stroke="${colors.warning}" stroke-width="3" stroke-dasharray="${circumference}" stroke-dashoffset="${dashOffset}" stroke-linecap="round" transform="rotate(-90 ${circleX} ${circleY})"/>`;
    svg += `<text x="${circleX}" y="${circleY + 7}" font-size="20" font-weight="bold" fill="${colors.warning}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif" text-anchor="middle">🔥</text>`;
    
    svg += `<text x="${circleX + 35}" y="${circleY + 5}" font-size="24" font-weight="bold" fill="${colors.warning}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">${formatNumber(stats.currentStreak || 10)}</text>`;
    svg += `<text x="${box2X + 15}" y="${yOffset + 75}" font-size="12" fill="${colors.text}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">Current Streak</text>`;
    svg += `<text x="${box2X + 15}" y="${yOffset + 90}" font-size="9" fill="${colors.textLight}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">Dec 29, 2025 - Jan 7, 2026</text>`;

    // Longest Streak
    const box3X = box2X + boxWidth;
    svg += `<rect x="${box3X}" y="${yOffset}" width="${boxWidth - boxSpacing}" height="${boxHeight}" fill="${colors.cardLight}" rx="10"/>`;
    svg += `<text x="${box3X + 15}" y="${yOffset + 35}" font-size="28" font-weight="bold" fill="${colors.success}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">✅</text>`;
    svg += `<text x="${box3X + 50}" y="${yOffset + 35}" font-size="28" font-weight="bold" fill="${colors.success}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">${formatNumber(stats.longestStreak || 10)}</text>`;
    svg += `<text x="${box3X + 15}" y="${yOffset + 58}" font-size="12" fill="${colors.text}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">Longest Streak</text>`;
    svg += `<text x="${box3X + 15}" y="${yOffset + 75}" font-size="9" fill="${colors.textLight}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">Dec 29, 2025 - Jan 7, 2026</text>`;

    yOffset += boxHeight + 20;
  }

  // Contribution Activity Chart
  if (config.displayOptions.showCharts) {
    const chartHeight = 140;
    svg += `<rect x="${leftColX}" y="${yOffset}" width="${width - 60}" height="${chartHeight}" fill="${colors.cardLight}" rx="10"/>`;
    svg += `<text x="${leftColX + 15}" y="${yOffset + 20}" font-size="14" font-weight="bold" fill="${colors.highlight}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">🔄 Contribution Activity</text>`;
    svg += `<text x="${leftColX + 15}" y="${yOffset + 35}" font-size="10" fill="${colors.textLight}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">Daily contributions   Dec 2025 - Jan 2026</text>`;

    // Generate sample data for chart
    const dataPoints = 60;
    const chartData = Array(dataPoints).fill(0).map(() => Math.floor(Math.random() * 20));
    const maxValue = Math.max(...chartData, 1);
    
    const chartX = leftColX + 15;
    const chartY = yOffset + 50;
    const chartWidth = width - 90;
    const chartInnerHeight = 80;
    
    // Y-axis labels
    svg += `<text x="${chartX - 5}" y="${chartY}" font-size="8" fill="${colors.textLight}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif" text-anchor="end">28</text>`;
    svg += `<text x="${chartX - 5}" y="${chartY + chartInnerHeight / 2}" font-size="8" fill="${colors.textLight}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif" text-anchor="end">14</text>`;
    svg += `<text x="${chartX - 5}" y="${chartY + chartInnerHeight}" font-size="8" fill="${colors.textLight}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif" text-anchor="end">0</text>`;

    // X-axis marks
    const xAxisY = chartY + chartInnerHeight + 10;
    [0, 15, 27, 52].forEach((day) => {
      const x = chartX + (day / dataPoints) * chartWidth;
      svg += `<text x="${x}" y="${xAxisY}" font-size="8" fill="${colors.textLight}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif" text-anchor="middle">${day}</text>`;
    });

    // Chart line
    let pathData = '';
    chartData.forEach((value, index) => {
      const x = chartX + (index / (dataPoints - 1)) * chartWidth;
      const y = chartY + chartInnerHeight - (value / maxValue) * chartInnerHeight;
      pathData += index === 0 ? `M ${x},${y}` : ` L ${x},${y}`;
    });

    // Area fill
    const areaPath = `${pathData} L ${chartX + chartWidth},${chartY + chartInnerHeight} L ${chartX},${chartY + chartInnerHeight} Z`;
    svg += `<path d="${areaPath}" fill="url(#areaGradient)"/>`;
    
    // Line
    svg += `<path d="${pathData}" stroke="${colors.highlight}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  svg += '</svg>';
  return svg;
}

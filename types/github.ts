export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  twitter_username: string | null;
  company: string | null;
  blog: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  public_gists: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  url: string;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface GitHubStats {
  totalRepos: number;
  totalFollowers: number;
  totalFollowing: number;
  totalStars: number;
  totalForks: number;
  totalGists: number;
  joinedDate: string;
  topLanguages: { [key: string]: number };
  topRepos: GitHubRepo[];
  contributions: number;
}

export interface StatsCardConfig {
  username: string;
  theme: 'dark' | 'light' | 'neon' | 'ocean' | 'tokyo' | 'dracula';
  displayOptions: {
    showRepositories: boolean;
    showFollowers: boolean;
    showStars: boolean;
    showLanguages: boolean;
    showJoinDate: boolean;
    showLocation: boolean;
    showName: boolean;
    showContributions: boolean;
  };
}

export interface EmbedCode {
  markdown: string;
  html: string;
  svg: string;
}

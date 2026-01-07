import axios from 'axios';
import { GitHubUser, GitHubRepo, GitHubStats } from '@/types/github';

const GITHUB_API_BASE = 'https://api.github.com';

const githubAxios = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: {
    Accept: 'application/vnd.github.v3+json',
    ...(process.env.GITHUB_TOKEN && { Authorization: `token ${process.env.GITHUB_TOKEN}` }),
  },
});

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  try {
    const response = await githubAxios.get<GitHubUser>(`/users/${username}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please add a GITHUB_TOKEN to your .env.local file for higher limits (5000 requests/hour vs 60).');
    }
    if (error.response?.status === 404) {
      throw new Error(`User "${username}" not found on GitHub. Please check the username and try again.`);
    }
    throw new Error(`Failed to fetch user ${username}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchUserRepositories(username: string): Promise<GitHubRepo[]> {
  try {
    const response = await githubAxios.get<GitHubRepo[]>(`/users/${username}/repos?per_page=100&sort=stars&order=desc`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please add a GITHUB_TOKEN to your .env.local file.');
    }
    throw new Error(`Failed to fetch repositories for ${username}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchUserContributions(username: string): Promise<number> {
  try {
    // This endpoint returns issues and PRs created by the user
    const response = await githubAxios.get(`/search/issues?q=author:${username}&per_page=1`);
    return response.data.total_count;
  } catch (error) {
    console.error('Failed to fetch contributions:', error);
    return 0;
  }
}

export function calculateTopLanguages(repos: GitHubRepo[]): { [key: string]: number } {
  const languages: { [key: string]: number } = {};

  repos.forEach((repo) => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });

  // Sort by count and return top 5
  return Object.fromEntries(
    Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  );
}

export function calculateTotalStars(repos: GitHubRepo[]): number {
  return repos.reduce((total, repo) => total + repo.stargazers_count, 0);
}

export function calculateTotalForks(repos: GitHubRepo[]): number {
  return repos.reduce((total, repo) => total + repo.forks_count, 0);
}

export async function fetchCompleteStats(username: string): Promise<{ stats: GitHubStats; user: GitHubUser }> {
  try {
    const user = await fetchGitHubUser(username);
    const repos = await fetchUserRepositories(username);
    const contributions = await fetchUserContributions(username);

    const topLanguages = calculateTopLanguages(repos);
    const totalStars = calculateTotalStars(repos);
    const totalForks = calculateTotalForks(repos);
    const topRepos = repos.slice(0, 5);

    const stats = {
      totalRepos: user.public_repos,
      totalFollowers: user.followers,
      totalFollowing: user.following,
      totalStars,
      totalForks,
      totalGists: user.public_gists,
      joinedDate: new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      topLanguages,
      topRepos,
      contributions,
    };

    return { stats, user };
  } catch (error) {
    throw new Error(`Failed to fetch complete stats for ${username}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

import axios from 'axios';
import { GitHubUser, GitHubRepo, GitHubStats, ContributionData } from '@/types/github';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

const githubAxios = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: {
    Accept: 'application/vnd.github.v3+json',
    ...(process.env.GITHUB_TOKEN && { Authorization: `token ${process.env.GITHUB_TOKEN}` }),
  },
});

const graphqlAxios = axios.create({
  headers: {
    'Content-Type': 'application/json',
    ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
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

export async function fetchUserStats(username: string): Promise<{
  pullRequests: number;
  issues: number;
  contributions: number;
}> {
  try {
    // If no token, contributions will be 0 (GitHub doesn't expose this in public API)
    if (!process.env.GITHUB_TOKEN) {
      return {
        pullRequests: 0,
        issues: 0,
        contributions: 0,
      };
    }

    const query = `
      query($userName:String!) {
        user(login: $userName) {
          contributionsCollection {
            totalCommitContributions
            totalIssueContributions
            totalPullRequestContributions
            totalRepositoryContributions
          }
        }
      }
    `;

    const response = await graphqlAxios.post(GITHUB_GRAPHQL_URL, {
      query,
      variables: { userName: username },
    });

    if (response.data.errors) {
      console.error('GraphQL error:', response.data.errors);
      return {
        pullRequests: 0,
        issues: 0,
        contributions: 0,
      };
    }

    const collection = response.data.data?.user?.contributionsCollection;
    if (collection) {
      return {
        pullRequests: collection.totalPullRequestContributions || 0,
        issues: collection.totalIssueContributions || 0,
        contributions:
          (collection.totalCommitContributions || 0) +
          (collection.totalIssueContributions || 0) +
          (collection.totalPullRequestContributions || 0) +
          (collection.totalRepositoryContributions || 0),
      };
    }

    return {
      pullRequests: 0,
      issues: 0,
      contributions: 0,
    };
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    return {
      pullRequests: 0,
      issues: 0,
      contributions: 0,
    };
  }
}

// Fetch detailed contribution calendar (last year) using GraphQL
async function fetchGraphQLContributions(username: string): Promise<{
  pullRequests: number;
  issues: number;
  totalContributions: number;
  daily: ContributionData[];
}> {
  try {
    if (!process.env.GITHUB_TOKEN) {
      return { pullRequests: 0, issues: 0, totalContributions: 0, daily: [] };
    }

    const query = `
      query($userName:String!) {
        user(login: $userName) {
          contributionsCollection {
            totalCommitContributions
            totalIssueContributions
            totalPullRequestContributions
            totalRepositoryContributions
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    const response = await graphqlAxios.post(GITHUB_GRAPHQL_URL, {
      query,
      variables: { userName: username },
    });

    if (response.data.errors) {
      console.error('GraphQL error:', response.data.errors);
      return { pullRequests: 0, issues: 0, totalContributions: 0, daily: [] };
    }

    const collection = response.data.data?.user?.contributionsCollection;
    if (!collection) {
      return { pullRequests: 0, issues: 0, totalContributions: 0, daily: [] };
    }

    const pr = collection.totalPullRequestContributions || 0;
    const iss = collection.totalIssueContributions || 0;
    const commits = collection.totalCommitContributions || 0;
    const reposContrib = collection.totalRepositoryContributions || 0;
    const totalContributions = collection.contributionCalendar?.totalContributions || (pr + iss + commits + reposContrib);

    const weeks = collection.contributionCalendar?.weeks || [];
    const daily: ContributionData[] = [];
    weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        daily.push({ date: day.date, count: day.contributionCount });
      });
    });

    // Ensure sorted by date
    daily.sort((a, b) => (a.date > b.date ? 1 : -1));

    return { pullRequests: pr, issues: iss, totalContributions, daily };
  } catch (error) {
    console.error('Failed to fetch GraphQL contributions:', error);
    return { pullRequests: 0, issues: 0, totalContributions: 0, daily: [] };
  }
}

export function calculateTopLanguages(repos: GitHubRepo[]): { [key: string]: number } {
  const languages: { [key: string]: number } = {};
  let totalCount = 0;

  repos.forEach((repo) => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
      totalCount++;
    }
  });

  // Convert to percentages and return top 5
  const percentages: { [key: string]: number } = {};
  Object.entries(languages).forEach(([lang, count]) => {
    percentages[lang] = Math.round((count / totalCount) * 100);
  });

  return Object.fromEntries(
    Object.entries(percentages)
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
    const gql = await fetchGraphQLContributions(username);

    // Use real daily contribution data from GraphQL (last 31 days)
    const allDays = gql.daily;
    const contributionData: ContributionData[] = allDays.length > 0
      ? allDays.slice(Math.max(0, allDays.length - 31))
      : [];

    // Calculate streaks from contribution data
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Check streaks from the end (current) backwards
    for (let i = contributionData.length - 1; i >= 0; i--) {
      if (contributionData[i].count > 0) {
        tempStreak++;
      } else if (tempStreak > 0) {
        currentStreak = tempStreak;
        break;
      }
    }

    // Calculate longest streak
    tempStreak = 0;
    for (const data of contributionData) {
      if (data.count > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Calculate contributed to (repos that aren't forks and have been updated)
    const activeRepos = repos.filter((repo) => {
      if (repo.fork) return false;
      const pushed = new Date(repo.pushed_at);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return pushed > threeMonthsAgo;
    });
    const contributedTo = Math.max(5, activeRepos.length);

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
      contributions: gql.totalContributions,
      contributionData,
      currentStreak: Math.max(currentStreak, 0),
      longestStreak: Math.max(longestStreak, 1),
      pullRequests: gql.pullRequests,
      issues: gql.issues,
      contributedTo,
    };

    return { stats, user };
  } catch (error) {
    throw new Error(`Failed to fetch complete stats for ${username}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

# API Usage Examples

This document provides practical examples of how to use the GitHub Insights Generator API.

## 📋 Table of Contents

1. [Basic Usage](#basic-usage)
2. [SVG Endpoint Examples](#svg-endpoint-examples)
3. [Stats Endpoint Examples](#stats-endpoint-examples)
4. [Integration Examples](#integration-examples)
5. [Query Parameters](#query-parameters)

---

## Basic Usage

The API is built on Next.js and provides two main endpoints:

- **SVG Generation**: `/api/insights/[username]` - Returns an SVG image
- **Statistics**: `/api/stats/[username]` - Returns JSON data

### Base URL

```
http://localhost:3000  # Development
https://yourdomain.com  # Production
```

---

## SVG Endpoint Examples

### Get Default Stats Card

```bash
curl http://localhost:3000/api/insights/octocat
```

**Response:** SVG image (Content-Type: `image/svg+xml`)

### With Theme Parameter

```bash
# Dark theme (default)
curl "http://localhost:3000/api/insights/octocat?theme=dark"

# Light theme
curl "http://localhost:3000/api/insights/octocat?theme=light"

# Neon theme
curl "http://localhost:3000/api/insights/octocat?theme=neon"

# Ocean theme
curl "http://localhost:3000/api/insights/octocat?theme=ocean"
```

### With Display Options

```bash
# Show only repositories and stars
curl "http://localhost:3000/api/insights/octocat?showRepositories=true&showStars=true&showFollowers=false&showLanguages=false"

# Show all options (default)
curl "http://localhost:3000/api/insights/octocat?showRepositories=true&showFollowers=true&showStars=true&showLanguages=true&showJoinDate=true&showLocation=true"

# Show only languages
curl "http://localhost:3000/api/insights/octocat?showRepositories=false&showFollowers=false&showStars=false&showLanguages=true&showJoinDate=false&showLocation=false"
```

### Complete URL Example

```
http://localhost:3000/api/insights/octocat?theme=neon&showRepositories=true&showStars=true&showLanguages=true&showFollowers=false
```

---

## Stats Endpoint Examples

### Get JSON Statistics

```bash
curl http://localhost:3000/api/stats/octocat
```

**Response:**

```json
{
  "totalRepos": 2,
  "totalFollowers": 1234,
  "totalFollowing": 5,
  "totalStars": 5678,
  "totalForks": 200,
  "totalGists": 10,
  "joinedDate": "October 20, 2011",
  "topLanguages": {
    "JavaScript": 5,
    "Python": 3,
    "Ruby": 2
  },
  "topRepos": [
    {
      "id": 1296269,
      "name": "Hello-World",
      "full_name": "octocat/Hello-World",
      "description": "A simple Hello World Repository",
      "url": "https://api.github.com/repos/octocat/Hello-World",
      "html_url": "https://github.com/octocat/Hello-World",
      "language": "Python",
      "stargazers_count": 80,
      "forks_count": 9,
      "open_issues_count": 0,
      "watchers_count": 80,
      "created_at": "2011-01-26T19:01:12Z",
      "updated_at": "2011-01-26T19:14:43Z",
      "pushed_at": "2011-01-26T19:06:43Z"
    }
  ],
  "contributions": 1234
}
```

### Using with JavaScript/Fetch API

```javascript
// Fetch stats
async function getGitHubStats(username) {
  const response = await fetch(`/api/stats/${username}`);
  const stats = await response.json();
  return stats;
}

// Usage
getGitHubStats('octocat').then(stats => {
  console.log(`${username} has ${stats.totalRepos} repositories`);
  console.log(`Total stars: ${stats.totalStars}`);
  console.log(`Followers: ${stats.totalFollowers}`);
});
```

### Using with Python

```python
import requests

def get_github_stats(username):
    url = f"http://localhost:3000/api/stats/{username}"
    response = requests.get(url)
    return response.json()

# Usage
stats = get_github_stats('octocat')
print(f"Repositories: {stats['totalRepos']}")
print(f"Stars: {stats['totalStars']}")
print(f"Followers: {stats['totalFollowers']}")
```

---

## Integration Examples

### HTML Integration

```html
<!-- Display stats card in HTML -->
<div align="center">
  <h2>My GitHub Stats</h2>
  <img src="http://localhost:3000/api/insights/octocat?theme=dark" alt="GitHub Stats" />
</div>
```

### Markdown Integration

```markdown
# My GitHub Statistics

![GitHub Stats](http://localhost:3000/api/insights/octocat?theme=dark)

## More About Me

Check out my GitHub profile for more information!
```

### React Component

```jsx
import { useEffect, useState } from 'react';

export function GitHubStatsCard({ username, theme = 'dark' }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/stats/${username}`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [username]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="github-stats">
      <img 
        src={`/api/insights/${username}?theme=${theme}`} 
        alt={`${username} GitHub Stats`}
      />
      <h3>{username}</h3>
      <p>Repositories: {stats.totalRepos}</p>
      <p>Followers: {stats.totalFollowers}</p>
      <p>Total Stars: {stats.totalStars}</p>
    </div>
  );
}
```

### Next.js Server Component

```tsx
// app/stats/[username]/page.tsx
import { Suspense } from 'react';

async function StatsData({ username }: { username: string }) {
  const res = await fetch(
    `http://localhost:3000/api/stats/${username}`,
    { next: { revalidate: 3600 } }
  );
  const stats = await res.json();

  return (
    <div className="space-y-4">
      <h1>{username}'s GitHub Stats</h1>
      <img 
        src={`/api/insights/${username}?theme=dark`} 
        alt="Stats" 
      />
      <p>Total Repos: {stats.totalRepos}</p>
      <p>Total Followers: {stats.totalFollowers}</p>
      <p>Total Stars: {stats.totalStars}</p>
    </div>
  );
}

export default function StatPage({ params }: { params: { username: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StatsData username={params.username} />
    </Suspense>
  );
}
```

---

## Query Parameters

### SVG Endpoint Query Parameters

| Parameter | Values | Default | Description |
|-----------|--------|---------|-------------|
| `theme` | `dark`, `light`, `neon`, `ocean` | `dark` | Color theme |
| `showRepositories` | `true`, `false` | `true` | Show repo count |
| `showFollowers` | `true`, `false` | `true` | Show followers |
| `showStars` | `true`, `false` | `true` | Show total stars |
| `showLanguages` | `true`, `false` | `true` | Show top languages |
| `showJoinDate` | `true`, `false` | `true` | Show join date |
| `showLocation` | `true`, `false` | `true` | Show location |

### Example: Minimal Display

```
/api/insights/octocat?showRepositories=true&showStars=true&showLanguages=false&showFollowers=false&showJoinDate=false&showLocation=false&theme=neon
```

---

## Response Types

### SVG Response (Content-Type: `image/svg+xml`)

```
HTTP/1.1 200 OK
Content-Type: image/svg+xml
Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400

<svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
  ...SVG content...
</svg>
```

### JSON Response (Content-Type: `application/json`)

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400

{
  "totalRepos": 2,
  "totalFollowers": 1234,
  ...
}
```

### Error Response

```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": "Failed to fetch user octocat: User not found"
}
```

---

## Caching

Both endpoints implement caching for performance:

- **Server-side cache**: 1 hour (ISR - Incremental Static Regeneration)
- **Browser cache**: 1 day stale-while-revalidate

This means:
- First request is fresh
- Subsequent requests within 1 hour are cached
- After 1 hour, cached version is served while new data is fetched in background

---

## Rate Limits

### Without Authentication
- 60 requests per hour
- GitHub API rate limit

### With Authentication (GITHUB_TOKEN)
- 5,000 requests per hour
- Much more reliable for production

### Set Token in `.env.local`

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Get your token: https://github.com/settings/tokens

---

## Troubleshooting

### "User not found" (404)

```json
{
  "error": "Failed to fetch user invalidusername: Not Found"
}
```

**Solution**: Verify the GitHub username is correct and the profile is public.

### Rate Limit Exceeded (403)

```json
{
  "error": "Failed to fetch..."
}
```

**Solution**: 
1. Add a GitHub personal access token
2. Wait for the rate limit to reset (1 hour)
3. Use the Neon theme which requires fewer API calls

### Server Error (500)

```json
{
  "error": "Failed to fetch complete stats..."
}
```

**Solution**: Check the server logs and ensure GitHub API is accessible.

---

## Best Practices

1. ✅ **Cache the results** - Don't call the API on every page load
2. ✅ **Use authentication** - Add a GitHub token for production
3. ✅ **Handle errors** - Display meaningful error messages
4. ✅ **Validate usernames** - Check username format before API call
5. ✅ **Monitor rate limits** - Track API usage
6. ✅ **Update periodically** - Cache for 1-24 hours depending on needs

---

## Support

For issues or questions:
- Check GitHub API documentation: https://docs.github.com
- Review implementation guide: [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
- Check project README: [README.md](./README.md)


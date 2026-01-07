# GitHub Insights Generator

A modern web application that generates beautiful, customizable GitHub statistics cards for your profile README.

## 🎯 Overview

GitHub Insights Generator allows you to:
- Enter any GitHub username
- Select from multiple themes (Dark, Light, Neon, Ocean)
- Customize which statistics to display
- Preview your stats card in real-time
- Copy embed code in multiple formats (SVG, HTML, Markdown)
- Use the generated card in your GitHub profile README

## ✨ Features

### Core Features
- ✅ Real-time GitHub API integration
- ✅ Multiple built-in themes
- ✅ Checkbox-based configuration panel
- ✅ Live preview rendering
- ✅ One-click code copy functionality
- ✅ Responsive design

### Statistics Display
- Total public repositories
- Total followers
- Total stars earned
- Top used programming languages
- Join date
- User location
- Top repositories
- And more...

### Embed Formats
- **SVG** - Recommended for best quality
- **HTML** - For embedding in web pages
- **Markdown** - For GitHub README files

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- GitHub account (optional, but needed to fetch stats)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gitstate
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file (optional but recommended):
```bash
# Get your token from: https://github.com/settings/tokens
GITHUB_TOKEN=your_token_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
gitstate/
├── app/
│   ├── api/
│   │   ├── insights/[username]/      # SVG generation route
│   │   └── stats/[username]/         # JSON stats API route
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Main page
├── components/
│   ├── CardPreview.tsx               # Stats card preview
│   ├── DisplayOptions.tsx            # Display options selector
│   ├── EmbedCodeDisplay.tsx          # Embed code display & copy
│   ├── ThemeSelector.tsx             # Theme selector
│   └── UsernameInput.tsx             # GitHub username input
├── lib/
│   ├── card-generator.ts             # SVG & embed code generation
│   └── github-api.ts                 # GitHub API integration
├── types/
│   └── github.ts                     # TypeScript type definitions
├── public/                           # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Architecture

### Frontend
- **Framework**: Next.js 16
- **UI**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### Backend
- **API Routes**: Next.js API routes
- **Data Fetching**: Axios
- **Caching**: Next.js ISR (60 minutes)

### External APIs
- **GitHub REST API**: For user data, repositories, and statistics

## 🌐 API Endpoints

### GET `/api/insights/[username]`
Generates and returns an SVG statistics card

**Query Parameters:**
- `theme`: `dark` | `light` | `neon` | `ocean` (default: `dark`)
- `showRepositories`: `true` | `false`
- `showFollowers`: `true` | `false`
- `showStars`: `true` | `false`
- `showLanguages`: `true` | `false`
- `showJoinDate`: `true` | `false`
- `showLocation`: `true` | `false`

**Example:**
```
GET /api/insights/octocat?theme=neon&showLanguages=true
```

### GET `/api/stats/[username]`
Returns GitHub statistics as JSON

**Example:**
```
GET /api/stats/octocat
```

## 🎨 Themes

### Dark Theme
- Background: `#1a1a2e`
- Card: `#16213e`
- Text: `#eaeaea`
- Highlight: `#e94560`

### Light Theme
- Background: `#f5f5f5`
- Card: `#ffffff`
- Text: `#333333`
- Highlight: `#3498db`

### Neon Theme
- Background: `#0a0e27`
- Card: `#1a1f3a`
- Text: `#00ff88`
- Highlight: `#00d9ff`

### Ocean Theme
- Background: `#0c1e3a`
- Card: `#1a3a52`
- Text: `#a8d8f0`
- Highlight: `#4db8ff`

## 📝 Usage Examples

### Using in GitHub README

1. Generate your stats card
2. Select your preferred theme
3. Copy the Markdown embed code
4. Paste in your README.md:

```markdown
<div align="center">
  <img src="https://yoursite.com/api/insights/octocat?theme=dark" />
</div>
```

## 🔐 Security Considerations

- ✅ No API tokens exposed to client
- ✅ GitHub token stored in environment variables
- ✅ Rate limiting handled automatically
- ✅ Caching implemented
- ✅ Proper error handling

## 📊 GitHub API Rate Limits

- **Unauthenticated requests**: 60 requests/hour
- **Authenticated requests**: 5,000 requests/hour

Configure your GitHub token in `.env.local` for higher limits.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
vercel deploy
```

### Environment Variables

Add to your hosting platform:
- `GITHUB_TOKEN` (optional)
- `NEXT_PUBLIC_APP_URL`

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built with ❤️ by Abir

---

**Happy coding!** 🚀

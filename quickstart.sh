#!/bin/bash

# GitHub Insights Generator - Quick Start Script
# This script helps you get started with the project

echo "🚀 GitHub Insights Generator - Quick Start"
echo "=========================================="
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi
echo "✓ Node.js $(node --version) is installed"
echo ""

# Check npm
echo "✓ Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
echo "✓ npm $(npm --version) is installed"
echo ""

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✓ Dependencies installed"
    echo ""
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local..."
    cat > .env.local << EOF
# GitHub API Token (optional but recommended for higher rate limits)
# Get your token from: https://github.com/settings/tokens
# GITHUB_TOKEN=your_token_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    echo "✓ .env.local created"
    echo ""
fi

# Build check
echo "🏗️  Building project..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Build successful!"
    echo ""
else
    echo "⚠️  Build had issues, but you can still run the dev server"
    echo ""
fi

# Show next steps
echo "=========================================="
echo "✅ Setup Complete!"
echo ""
echo "📌 Next Steps:"
echo ""
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Open your browser:"
echo "   http://localhost:3000"
echo ""
echo "3. Test with a GitHub username (e.g., 'octocat')"
echo ""
echo "=========================================="
echo ""
echo "📚 Documentation:"
echo "   - README.md - Full documentation"
echo "   - IMPLEMENTATION_GUIDE.md - Implementation details"
echo ""
echo "🔗 Quick Links:"
echo "   - GitHub Docs: https://docs.github.com"
echo "   - Next.js Docs: https://nextjs.org/docs"
echo "   - Tailwind CSS: https://tailwindcss.com/docs"
echo ""
echo "Happy coding! 🎉"

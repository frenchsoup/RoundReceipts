#!/bin/bash

echo "🏌️ Setting up Round Receipts..."

# Backend setup
echo ""
echo "📦 Setting up backend..."
cd backend
npm install

# Copy env file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file - please update with your database credentials"
fi

# Setup database
echo "🗄️ Setting up database..."
npm run db:setup
npm run db:seed

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd ../frontend
npm install

# Install Tailwind dependencies
npx tailwindcss init -p

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📖 Next steps:"
echo "1. Update backend/.env with your PostgreSQL credentials"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend: cd frontend && npm run dev"
echo "4. Open http://localhost:3000 in your browser"

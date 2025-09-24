# Gatewayz Frontend - Production Setup Guide

This guide will help you deploy the Gatewayz frontend application to production with full backend integration.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Gatewayz API key (get from [https://api.gatewayz.ai](https://api.gatewayz.ai))

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd gatewayz-frontend
npm install
# or
pnpm install
```

2. **Environment Configuration:**
```bash
cp env.example .env.local
```

3. **Configure environment variables:**
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.gatewayz.ai
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

4. **Run development server:**
```bash
npm run dev
# or
pnpm dev
```

## 🔧 Production Features

### ✅ Implemented Features

- **API Integration**: Full integration with Gatewayz production API
- **Authentication**: API key-based authentication system
- **Real-time Data**: Live model data and provider statistics
- **Credit Management**: Real-time credit balance and usage tracking
- **Error Handling**: Comprehensive error boundaries and retry logic
- **Loading States**: Skeleton loaders and loading indicators
- **Performance**: Optimized with caching and retry mechanisms
- **Security**: API key validation and secure storage

### 🎯 Key Components

#### Authentication System
- **API Key Auth**: Secure API key authentication
- **Firebase Auth**: Traditional email/password authentication
- **Social Login**: Google and GitHub OAuth integration

#### Data Management
- **Real-time Models**: Live model data from Gatewayz API
- **Provider Stats**: Real-time provider performance metrics
- **Credit System**: Live credit balance and usage tracking

#### Error Handling
- **Error Boundaries**: Graceful error handling
- **Retry Logic**: Automatic retry for failed requests
- **Loading States**: Skeleton loaders for better UX

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel:**
```bash
npm install -g vercel
vercel login
vercel
```

2. **Set environment variables in Vercel dashboard:**
- `NEXT_PUBLIC_API_URL`: `https://api.gatewayz.ai`
- Firebase configuration variables

3. **Deploy:**
```bash
vercel --prod
```

### Docker Deployment

1. **Build Docker image:**
```bash
docker build -t gatewayz-frontend .
```

2. **Run container:**
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.gatewayz.ai \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  gatewayz-frontend
```

### Manual Deployment

1. **Build for production:**
```bash
npm run build
```

2. **Start production server:**
```bash
npm start
```

## 🔑 API Integration

### Getting Your API Key

1. Visit [https://api.gatewayz.ai](https://api.gatewayz.ai)
2. Sign up for an account
3. Generate an API key from your dashboard
4. Use the API key in the application

### API Endpoints Used

- `GET /health` - Health check
- `GET /models` - Available AI models
- `GET /models/providers` - Provider statistics
- `GET /user/balance` - Credit balance
- `GET /user/profile` - User profile
- `POST /v1/chat/completions` - Chat completion

## 🎨 UI/UX Preservation

The production version maintains **exact UI/UX** from the demo:

- ✅ All visual components unchanged
- ✅ Same color scheme and styling
- ✅ Identical layout and navigation
- ✅ Same user interactions
- ✅ Preserved animations and transitions

## 🔒 Security Features

- **API Key Validation**: Secure API key storage and validation
- **Error Boundaries**: Graceful error handling
- **Rate Limiting**: Built-in rate limiting support
- **CORS Protection**: Cross-origin request protection
- **Input Validation**: Comprehensive input validation

## 📊 Monitoring & Analytics

- **Health Checks**: Built-in health monitoring
- **Error Reporting**: Production error tracking
- **Performance Monitoring**: Real-time performance metrics
- **User Analytics**: Usage tracking and analytics

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/       # Dashboard components
│   ├── layout/         # Layout components
│   └── ui/             # UI components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # Utility libraries
│   ├── api.ts          # API client
│   ├── config.ts       # Configuration
│   └── database.ts     # Database utilities
└── types/              # TypeScript types
```

## 🐛 Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify API key is correct
   - Check API key permissions
   - Ensure API key is not expired

2. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check environment variables

3. **Authentication Issues**
   - Verify Firebase configuration
   - Check API key format
   - Ensure proper CORS settings

### Support

- **Documentation**: [https://api.gatewayz.ai/docs](https://api.gatewayz.ai/docs)
- **API Reference**: [https://api.gatewayz.ai/redoc](https://api.gatewayz.ai/redoc)
- **Issues**: Create GitHub issues for bugs

## 📈 Performance

### Optimizations Implemented

- **Code Splitting**: Automatic code splitting
- **Image Optimization**: Next.js image optimization
- **Caching**: API response caching
- **Retry Logic**: Automatic retry for failed requests
- **Loading States**: Skeleton loaders for better UX

### Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

## 🔄 Updates

To update the application:

1. **Pull latest changes:**
```bash
git pull origin main
```

2. **Update dependencies:**
```bash
npm update
```

3. **Rebuild and redeploy:**
```bash
npm run build
# Deploy using your preferred method
```

---

**Ready for Production!** 🚀

The Gatewayz frontend is now production-ready with full backend integration while maintaining the exact UI/UX from the demo version.

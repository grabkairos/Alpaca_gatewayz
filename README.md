# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
# Gatewayz

GatewayZ is a comprehensive AI model management platform, providing a unified interface for accessing and managing various Large Language Models (LLMs). The platform offers model browsing, interactive chat functionality, performance analytics, and developer tools.

## Features

### Core Functionality
- **Unified Model Access**: Browse and access 300+ AI models from 60+ providers through a single interface
- **Interactive Chat**: Real-time chat interface with multiple AI models
- **Model Analytics**: Comprehensive rankings and performance insights
- **Developer Tools**: API management, settings, and integration tools
- **Responsive Design**: Modern UI with dark/light theme support

### Key Pages
- **Home**: Landing page with featured models and platform overview
- **Models**: Comprehensive model browser with filtering and search capabilities
- **Chat**: Interactive chat interface with model selection
- **Rankings**: Performance analytics and model comparisons
- **Settings**: User preferences, API keys, and configuration management
- **Developers**: Developer resources and documentation

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Recharts** - Data visualization

### AI Integration
- **Google Genkit** - AI orchestration framework
- **Google AI** - Gemini model integration
- **Firebase** - Authentication and backend services

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **pnpm** - Package management

## 📁 Project Structure

```
gatewayz-frontend/
├── src/
│   ├── ai/                    # AI integration and flows
│   │   ├── dev.ts            # Development AI configuration
│   │   ├── flows/
│   │   │   └── chat-flow.ts  # Chat flow implementation
│   │   └── genkit.ts         # Genkit AI setup
│   ├── app/                  # Next.js App Router pages
│   │   ├── chat/            # Chat interface
│   │   ├── models/          # Model browser
│   │   ├── rankings/        # Analytics dashboard
│   │   ├── settings/        # User settings
│   │   └── developers/      # Developer resources
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components
│   │   ├── chat/           # Chat-specific components
│   │   ├── dashboard/      # Analytics components
│   │   └── layout/         # Layout components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and data
│   │   ├── data.ts         # Model and analytics data
│   │   ├── models-data.ts  # Model definitions
│   │   └── firebase.ts     # Firebase configuration
│   └── styles/             # Global styles
├── docs/                   # Documentation
└── public/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Firebase project (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gatewayz-frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_PROJECT_ID=your_firebase_project_id
   ```

4. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Start AI development server** (in a separate terminal)
   ```bash
   pnpm genkit:dev
   ```

The application will be available at `http://localhost:3000`

## 📊 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm genkit:dev` - Start Genkit AI development server
- `pnpm genkit:watch` - Start Genkit with file watching

## 🎯 Key Features Deep Dive

### Model Management
- **300+ Models**: Access to models from OpenAI, Google, Anthropic, Meta, and more
- **Advanced Filtering**: Filter by modality, context length, pricing, and capabilities
- **Real-time Search**: Instant model discovery with intelligent search
- **Performance Metrics**: Token usage, latency, and cost tracking

### Chat Interface
- **Multi-Model Support**: Switch between different AI models seamlessly
- **Session Management**: Persistent chat history with local storage
- **Real-time Responses**: Streaming AI responses with loading states
- **Model Selection**: Easy model switching with categorized options

### Analytics Dashboard
- **Performance Rankings**: Model performance comparisons across categories
- **Usage Statistics**: Token generation and model usage analytics
- **Trend Analysis**: Historical performance data with interactive charts

- **Category Filtering**: Filter analytics by model categories and time ranges

### Developer Tools
- **API Management**: Manage API keys and provider settings
- **Integration Guides**: Documentation for API integration
- **Settings Panel**: Comprehensive configuration options
- **Provider Management**: Control which AI providers to use

## 🔧 Configuration

### Firebase Setup
The application uses Firebase for authentication. Configure your Firebase project in `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  projectId: "your-project-id",
  appId: "your-app-id",
  storageBucket: "your-storage-bucket",
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  messagingSenderId: "your-sender-id"
};
```

### AI Model Configuration
AI models are configured in `src/ai/genkit.ts` and model data is managed in `src/lib/models-data.ts`.

### Theme Configuration
The application supports dark/light themes with configuration in `tailwind.config.ts` and theme provider in `src/components/theme-provider.tsx`.

## 🚀 Deployment

### Firebase Hosting
The project is configured for Firebase Hosting with `apphosting.yaml`:

```yaml
run: pnpm run build && pnpm run start
```

### Environment Variables
Ensure all required environment variables are set in your deployment environment:
- `GOOGLE_AI_API_KEY`
- `FIREBASE_*` variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `docs/` folder
- Review the component examples in `src/components/`
=======
To get started, take a look at src/app/page.tsx.

Install and run

- cd src
- npm install
- npm run dev

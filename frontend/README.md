# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Daily Word Puzzle Game

A modern, interactive daily word guessing game built with React and TypeScript. Players receive visual hints each day to guess multiple words, with all words arranged so a specific column spells out a hidden message.

## 🎮 Game Features

### Core Gameplay
- **Daily Hints**: One visual hint released per day for each word
- **Progressive Revelation**: Hints accumulate over time, providing more clues
- **Hidden Message**: Words are aligned so a specific column forms a meaningful sentence
- **Interactive Word Grid**: Click and type to fill in letters
- **Visual Feedback**: Real-time validation and progress tracking

### User Interface
- **Split Layout**: Word grid on the left, hint viewer on the right
- **Hint Navigation**: Navigate between hints with arrow buttons
- **Grid View**: See all available hints as thumbnails
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Technical Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules with modern CSS features
- **State Management**: React Hooks (useState, useEffect)
- **Architecture**: Clean component separation with custom hooks

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── WordGrid/        # Word input grid component
│   └── HintViewer/      # Hint display and navigation component
├── hooks/               # Custom React hooks
│   ├── useGameState.ts  # Game state management
│   └── useHintViewer.ts # Hint navigation logic
├── services/            # API and data services
│   └── gameAPI.ts       # Mock API for game data
├── types/               # TypeScript type definitions
│   └── game.ts          # Game-related interfaces
├── utils/               # Utility functions
│   └── gameUtils.ts     # Game logic helpers
└── App.tsx              # Main application component
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd daily-word-puzzle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🎯 How to Play

1. **View Hints**: Use the right panel to view available visual hints
2. **Navigate Hints**: Click arrow buttons or use grid view to see all hints
3. **Check Hint Details**: Each hint shows the number of letters and which letter appears in the highlighted column
4. **Fill Words**: Click on letter cells in the word grid and type letters
5. **Keyboard Navigation**: Use arrow keys to move between cells
6. **Track Progress**: Watch the highlighted column reveal the hidden message as you fill words
7. **Complete Game**: Fill all words completely to reveal the final hidden message

## 🔧 Game Configuration

The mock API in `src/services/gameAPI.ts` can be easily configured:

- **Hints**: Update the `MOCK_HINTS` array with new images, letter counts, and highlighted letters
- **Target Words**: Modify the `ACTUAL_WORDS` array (hidden from players)
- **Highlighted Column**: Change `HIGHLIGHTED_COLUMN` index
- **Current Day**: Adjust day calculation logic

### Hint Structure

Each hint contains:
- **Image**: Visual clue (perfect rectangle format)
- **Letter Count**: Number of letters in the word
- **Highlighted Letter**: The letter that appears in the target column
- **Day**: When the hint becomes available

## 📱 Responsive Design

The game is fully responsive and optimized for:
- **Desktop**: Split layout with full features
- **Tablet**: Stacked layout with touch-friendly controls
- **Mobile**: Compact grid with optimized hint navigation

## 🎨 Customization

### Styling
- Each component has its own CSS file for easy customization
- CSS variables in `index.css` for consistent theming
- Responsive breakpoints defined for mobile-first design

### Game Logic
- Extend `gameUtils.ts` for new game mechanics
- Modify hooks for different state management approaches
- Update API service for real backend integration

## 🔄 Future Enhancements

- **Real API Integration**: Connect to backend service
- **User Accounts**: Save progress and statistics
- **Social Sharing**: Share game results
- **Difficulty Levels**: Multiple word lengths and hint complexities
- **Leaderboards**: Compete with other players
- **Offline Support**: Play without internet connection

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

- TypeScript for type safety
- ESLint for code consistency
- Modern React patterns with hooks
- Component composition and reusability
- Clean separation of concerns

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Built with ❤️ using React, TypeScript, and modern web technologies.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

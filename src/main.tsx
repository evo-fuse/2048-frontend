import { createRoot } from 'react-dom/client';
import App from './App';
import GlobalStyle from './components/GlobalStyle';
import './index.css';
import { GameProvider } from './context/GameContext';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <GameProvider>
    <GlobalStyle />
    <App />
  </GameProvider>,
);

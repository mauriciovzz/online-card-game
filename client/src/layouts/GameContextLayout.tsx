import { Outlet } from 'react-router';
import { GameProvider } from '../contexts/GameContext';

export const GameContextLayout = () => {
  return (
    <GameProvider>
      <Outlet />
    </GameProvider>
  );
};

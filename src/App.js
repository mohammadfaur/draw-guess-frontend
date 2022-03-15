import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Welcome from './components/views/Welcome';
import GameSession from './components/GameSession';
import ChooseWord from './components/views/ChooseWord';

const { REACT_APP_API_URL } = process.env;

function App() {
  const [playerType, setPlayerType] = useState('');

  //type => to differentiate between a host and a guest.
  const playerTypeHandler = (type) => setPlayerType(() => type);

  return (
    <Routes>
      <Route
        path='/'
        element={
          <Welcome
            updatePlayerType={playerTypeHandler}
            apiUrl={REACT_APP_API_URL}
          />
        }
      />
      <Route
        path='game-room/:id'
        element={
          <GameSession
            playerType={playerType}
            updatePlayerType={playerTypeHandler}
            apiUrl={REACT_APP_API_URL}
          />
        }
      />

      {/* testing */}
      <Route
        path='/chooseword'
        element={<ChooseWord apiUrl={REACT_APP_API_URL} sessionId={1} />}
      />
    </Routes>
  );
}

export default App;

import { Routes, Route } from 'react-router-dom';
import './App.css';
import Welcome from './views/Welcome';
import Drawing from './views/Drawing';
import ChooseWord from './views/ChooseWord';
import Guessing from './views/Guessing';
import Waiting from './views/Waiting';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Welcome />} />
      <Route path=':id/wait' element={<Waiting />} />
      <Route path=':id/choose-word' element={<ChooseWord />} />
      <Route path=':id/draw' element={<Drawing />} />
      <Route path=':id/guess' element={<Guessing />} />
    </Routes>
  );
}

export default App;

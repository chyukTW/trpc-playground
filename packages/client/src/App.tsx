import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Apollo } from './pages/Apollo';
import { Home } from './pages/Home';
import { SSE } from './pages/SSE';
import { TARP } from './pages/TARP';
import { TRPC } from './pages/TRPC';

function App() {  
  return (
    <BrowserRouter>
      <Routes>
        <Route Component={Home} path='/'/>
        <Route Component={TRPC} path='/trpc'/>
        <Route Component={SSE} path='/sse'/>
        <Route Component={Apollo} path='/apollo'/>
        <Route Component={TARP} path='/tarp'/>
      </Routes>
    </BrowserRouter>
  );
}


export default App;

import React from 'react';
import {Routes, Route} from 'react-router-dom'
import { NavBar } from './components'
import { IrrigationPage, GraphPage } from './pages';

function App() {
  return (
    <Routes>
      <Route path='/' element={<NavBar/>}>
        <Route index element={<GraphPage/>}/>
        <Route path='/irrigation' element={<IrrigationPage/>}/>
      </Route>
      
    </Routes>
  );
}

export default App;

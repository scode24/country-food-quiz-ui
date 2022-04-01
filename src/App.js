// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Welcome from './components/Welcome';
import Question from './components/Question';

const colorList = ['#c6f50f', '#66cdaa', '#ffa500', '#f67453', '#f6c653']

const dynamicColor = {
  backgroundColor: colorList[Math.floor(Math.random() * 5)]
}

function App() {
  return (
    <div style={dynamicColor}>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Welcome />} />
          <Route exact path='/question' element={<Question />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

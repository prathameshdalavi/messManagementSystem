import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignupPage } from './pages/user/signup';
import { SignInPage } from './pages/user/signin';
import { HomePage } from './pages/user/home';
import { NearbyMessPage } from './pages/user/nearbyMess';
import { NearbyMessDetail } from './pages/user/nearbymessDetail';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/nearby" element={<NearbyMessPage />} />
        <Route path='/details' element={<NearbyMessDetail />} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
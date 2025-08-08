import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignupPage } from './pages/user/signup';
import { NearbyMessPage } from './pages/user/nearbyMess';
import { NearbyMessDetail } from './pages/user/nearbymessDetail';
import { UserDashboard } from './pages/user/dashboard';
import { SignInPage } from './pages/user/signin';
import { HomePage } from './pages/user/home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Dashboard layout with nested routes */}
        <Route path="/" element={<UserDashboard />}>
          <Route index element={<HomePage />} />
          <Route path="nearby" element={<NearbyMessPage />} />
          <Route path="details" element={<NearbyMessDetail />} />
          {/* Add more nested routes here if needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
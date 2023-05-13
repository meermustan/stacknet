import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Discussions from "./pages/Discussions";
import Projects from "./pages/Projects";
import Tutorials from "./pages/Tutorials";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Post from "./pages/Post";
import LoginSignupPopupState from "./contexts/LoginSignupPopupState";
import SignupPopup from "./components/SignupPopup";
import LoginPopup from "./components/LoginPopup";
import Profile from "./pages/Profile";
import Sections from "./pages/Sections";
import AdminPanel from "./pages/AdminPanel";
import AllUsers from "./components/AllUsers";
import ApprovePosts from "./components/ApprovePosts";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import IsLoggedInState from './contexts/IsLoggedInState'
import { UserContextState } from "./contexts/UserContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const isLoggedIn = window.localStorage.getItem("isLoggedIn");

  return (
    <>
      <IsLoggedInState>
        <LoginSignupPopupState>
          <UserContextState>
            <Router>
              <Navbar />
              <ToastContainer
                newestOnTop />
              <LoginPopup />
              <SignupPopup />
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/discussions" element={<Sections />} />
                <Route exact path="/discussions/:category" element={<Discussions />} />
                <Route exact path="/privacypolicy" element={<PrivacyPolicy />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/tutorials" element={<Tutorials />} />
                <Route exact path="/discussions/d/:id" element={<Post />} />
                <Route exact path="/u/profile/" element={isLoggedIn ? <Profile /> : <Home />} />
                <Route exact path="/admin" element={isLoggedIn ? <AdminPanel /> : <Home />}>
                  <Route path='/admin/allusers' element={isLoggedIn ? <AllUsers /> : <Home />} />
                  <Route path='/admin/approveposts/:categ' element={isLoggedIn ? <ApprovePosts /> : <Home />} />
                </Route>
              </Routes>
              <Footer />
            </Router>
          </UserContextState>
        </LoginSignupPopupState>
      </IsLoggedInState>
    </>
  );
}

export default App;

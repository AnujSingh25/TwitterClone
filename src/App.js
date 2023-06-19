import './App.css';
import Register from './pages/Register/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Profile from './pages/SharedLayoutPage/Profile/Profile';
import Home from './pages/SharedLayoutPage/Home/Home';
import Sidebar from './pages/SharedLayoutPage/Sidebar/Sidebar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import SingleUserPage from './pages/SharedLayoutPage/SingleUserPage/SingleUserPage';
import SingleTweetPage from './pages/SharedLayoutPage/SingleTweetPage/SingleTweetPage';


function App() {
  return (
    <>
      <ToastContainer />
      <Routes>

        <Route path='/' element={<ProtectedRoute><Sidebar /></ProtectedRoute>}>
          <Route index element={<><Home /> </>} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/:id' element={<SingleUserPage />} />
          <Route path='/tweet/:id' element={<SingleTweetPage />} />
        </Route>

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  );
}

export default App;

import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';

import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import Page4 from './components/Home/page4';
import Welcome from './components/Home/welcome';
import Page3 from './components/Home/page3';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Account from './pages/Account';
import Blogs from './pages/blogs';
import WriteBlogs from './pages/writeblogs';
import Blogspage from './components/blogspage/blogspage';
import Topic from './components/Topic/Topic';
import Topicblogs from './components/topicblogs/topicblogs';
import { UserProvider } from './components/contexts/UserContext';
import Settings from './components/setting/setting';
import Purchase from './components/purchase/purchase';
import Payment_update from './components/payment_update/payment_update';
import ProtectedRoute from './components/protectedRoute/protectedRoute';
import ForgotPassword from './components/forgotPassword/forgotPassword';
import ResetPassword from './components/resetPassword/resetPassword';
import { useNavigate } from 'react-router-dom';
import ScrollToTop from './components/scrollToTop/scrollToTop'; 



function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}





function App() {
  const isUserSignedIn = !!localStorage.getItem('token');
  console.log(isUserSignedIn)
  const navigate = useNavigate();


  useEffect(() => {
    let isRefresh = false;
  
    const handleUnload = (event) => {
      if (isRefresh) {
        return;
      }
  
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/logout');
      }
      
      localStorage.clear();
      sessionStorage.clear();
    };
  
    const handleBeforeUnload = (event) => {
      isRefresh = true;
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, []);
  
  console.log(isUserSignedIn);

  
  

 /*useEffect(() => {
    const handleBeforeUnload = () => {
 
      localStorage.clear();
     // Clear all session storage
      sessionStorage.clear();
    };

    // Add event listener for when the user is about to close the tab or browser
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);*/



  return (
    <UserProvider>
      <div className="App">
        <Navbar />
        <ScrollToTop /> 
        
       
        <Routes>
       
        {/* <Route exact path='/' element={<ProtectedRoute><Home /></ProtectedRoute>}  */}
          <Route path='/home' element={<Home />} />
          <Route path='/' element={<Welcome />} />
          <Route path='/blogs' element={<Blogs />} />
          
          <Route path='/Topic' element={<Topic title={"Write"} />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/blogspage/:topic/:id/:key' element={<Blogspage/>} />
          <Route path='/updateblogs/:id' element={<WriteBlogs title={"Update"} />} />
          <Route path='/topic' element={<Topic/>} />
          <Route path='/writeblogs/:topic' element={<WriteBlogs title={"Write"} />}/>
          {/* <Route path='/writeblogs/:topic' element={<WriteBlogs title={"Write"} />}/> */}
          <Route path="/topic/:topic/:key" element={<Topicblogs />} />

          <Route path='/blog/:item._id' element={<WriteBlogs title={"Write"} />}/>
          <Route path='/page4/:id' element={<Page4  />}/>
          <Route path='/page3' element={<Page3  />}/>
          <Route path="/settings" element={<Settings />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/payment_update/:topic" element={<Payment_update />} />
          {/* {isUserSignedIn && <Route path='/account' element={<Account />} />} */}
          <Route path='/account' element={<Account/>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
        {/* <Chatgpt/> */}

      
      </div>
    </UserProvider>
    
  );
}

export default App;

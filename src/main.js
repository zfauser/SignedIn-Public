import React from 'react';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from './components/home/home.js';
import SignUp from './components/signUp/signUp.js';
import ForgotPassword from './components/forgotPassword/forgotPassword.js';
import Profile from './components/main/profile.js';
import Redirect from './components/redirect/redirect.js'


// This code is used to route the pages. React by default does not have a router. So we must use a third party router.
const Main = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Home />}></Route>
          <Route exact path='/signup' element={<SignUp />}></Route>
          <Route exact path='/forgotPassword' element={<ForgotPassword />}></Route>
          <Route exact path='/profile' element={<Profile />}></Route>
          <Route path='/redirect' element={<Redirect />}></Route>
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default Main;
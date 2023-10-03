import React, { FC, useContext, useEffect } from "react";
import "./assets/css/App.css";

import { Context } from "./index";

import UserPage from "./components/UserPage";
import { observer } from "mobx-react-lite";
import MainPage from "./components/MainPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";

const App: FC = () => {
  const { store } = useContext(Context);
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      store.checkAuth();
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage></MainPage>}></Route>
        <Route path="/login" element={<LoginForm></LoginForm>}></Route>
        <Route
          path="/register"
          element={<RegistrationForm></RegistrationForm>}
        ></Route>
        <Route path="/page/:username" element={<UserPage></UserPage>}></Route>
        {/*<Route path='/password/reset' element={<RestorePass/>}></Route>*/}
        {/*<Route path='/password/change/:session' element={<ChangePassForm/>}></Route>*/}
        <Route path="*" element={<h1>Not Found 404</h1>}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default observer(App);

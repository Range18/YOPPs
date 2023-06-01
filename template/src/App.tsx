import React, { FC, useContext, useEffect } from "react";
import "./App.css";

import { Context } from "./index";

import UserPage from "./components/UserPage";
import { observer } from "mobx-react-lite";

const App: FC = () => {
  const { store } = useContext(Context);
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      store.checkAuth();
    }
  }, []);
  return (
    <div>
      <UserPage></UserPage>
    </div>
  );
};

export default observer(App);

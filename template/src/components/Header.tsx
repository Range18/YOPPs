import React, { FC } from "react";
import { observer } from "mobx-react-lite";
import styles from "../assets/css/header.module.css";
import { useNavigate } from "react-router-dom";

const Header: FC = () => {
  const navigate = useNavigate();
  const login = () => {
    const path = "/login";
    navigate(path);
  };
  const register = () => {
    const path = "/register";
    navigate(path);
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1 className={styles.logoText}>YOPPs</h1>

        <div className={styles.buttons}>
          <button className={styles.loginBtn} onClick={login}>
            Login
          </button>
          <button className={styles.signUpBtn} onClick={register}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default observer(Header);

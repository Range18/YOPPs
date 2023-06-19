import React, { FC } from "react";
import { observer } from "mobx-react-lite";
import styles from "../assets/css/header.module.css";

const Header: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1 className={styles.logoText}>YOPPs</h1>

        <div className={styles.buttons}>
          <button className={styles.loginBtn}>Login</button>
          <button className={styles.signUpBtn}>Sign up</button>
        </div>
      </div>
    </div>
  );
};

export default observer(Header);

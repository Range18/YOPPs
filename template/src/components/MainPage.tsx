import React, { FC } from "react";
import { observer } from "mobx-react-lite";
import Header from "./Header";
import styles from "../assets/css/mainPage.module.css";

const MainPage: FC = () => {
  return (
    <div className={styles.container}>
      <Header></Header>
      <div className={styles.innerContainer}>
        <div className={styles.MainText}>YOUR ONE PAGE PROFILES</div>
        <button className={styles.createPageBtn}>Create Page</button>
      </div>
    </div>
  );
};

export default observer(MainPage);

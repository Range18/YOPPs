import React, { FC } from "react";
import { observer } from "mobx-react-lite";
import Header from "./Header";
import styles from "../assets/css/mainPage.module.css";
import { useNavigate } from "react-router-dom";

const MainPage: FC = () => {
  let navigate = useNavigate();
  const createPage = () => {
    let path = `/register`;
    navigate(path);
  };

  return (
    <div className={styles.container}>
      <Header></Header>
      <div className={styles.MainContainer}>
        <span className={styles.MainText}>YOUR ONE PAGE PROFILES</span>
        <span className={styles.secondText}>YOPPs.</span>
        <button className={styles.createPageBtn} onClick={createPage}>
          Create Page
        </button>
      </div>
    </div>
  );
};

export default observer(MainPage);

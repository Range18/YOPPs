import React, { FC, useContext, useEffect } from "react";
import { Context } from "../index";
import styles from "../assets/css/userPage.module.css";
import { observer } from "mobx-react-lite";
import { apiServer } from "../configTemplate";

const UserPage: FC = () => {
  const { store } = useContext(Context);

  const username: string | undefined = window.location.pathname
    .split("/")
    .at(-1);

  useEffect(() => {
    store.getUserPage(username!);
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.profileBoarder}>
        <img
          className={styles.avatar}
          src={`${apiServer.url}/userPage/get/assets/avatar/${username}`}
          alt={"user avatar"}
        ></img>

        <h2 className={styles.username}>
          {`${store.userPage.userData.username}`}
        </h2>

        <div className={styles.additionalUserData}>
          {`${store.userPage.userData.name} 
          ${store.userPage.userData.surname}, 
          ${store.userPage.userData.age}`}
        </div>

        <div className={styles.description}>
          {`${store.userPage.description}`}
        </div>
      </div>
    </div>
  );
};

export default observer(UserPage);

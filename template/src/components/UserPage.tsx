import React, {useContext, useEffect} from 'react';
import {Context} from "../index";

import {observer} from "mobx-react-lite";

const UserPage = () => {
    const {store} = useContext(Context)
    const username: string | undefined = window.location.pathname.split('/').at(-1)


    useEffect(() => {
        store.getUserPage(username!)
    }, [])

    return (
        <div>
            <h3>{JSON.stringify(store.UserPage)}</h3>
        </div>
    );
};

export default observer(UserPage);
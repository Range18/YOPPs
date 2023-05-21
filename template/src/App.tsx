import React, {useContext, useEffect} from 'react';
import './App.css';

import {Context} from "./index";

import UserPage from "./components/UserPage";

function App() {
    const {store} = useContext(Context)
    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            store.checkAuth()
        }
    }, [])
    return (
        <div>
            <UserPage></UserPage>
        </div>
    );
}

export default App;

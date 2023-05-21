import React, {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from 'mobx-react-lite';

const LoginForm: FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {store} = useContext(Context)

    return (
        <div>
            <input type={"email"} onChange={text => setEmail(text.target.value)} placeholder={'Email'}/>
            <input type={"password"} onChange={text => setPassword(text.target.value)} placeholder={'Password'}/>
            <button onClick={() => store.login(email, password)}>Login</button>
        </div>
    );
};

export default observer(LoginForm);
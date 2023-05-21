import React, {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from 'mobx-react-lite';

const RegistrationForm: FC = () => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const {store} = useContext(Context)

    return (
        <div>
            <input type={"email"} onChange={text => setEmail(text.target.value)} placeholder={'Email'}/>
            <input type={"username"} onChange={text => setUsername(text.target.value)} placeholder={'Username'}/>
            <input type={"password"} onChange={text => setPassword(text.target.value)} placeholder={'Password'}/>
            <button onClick={() => store.registration(email, username, password)}>Sign Up</button>
        </div>
    );
};

export default observer(RegistrationForm);
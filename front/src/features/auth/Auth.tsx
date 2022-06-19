import React, { useState } from 'react';
import styles from './Auth.module.css';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';

// tool-kit関連
import { useSelector, useDispatch } from 'react-redux';
// dispatchの型
import { AppDispatch } from '../../app/store';
// slice関連
import { toggleMode, fetchAsyncLogin, fetchAsyncRegister, fetchAsyncCreateProf, selectIsLoginView } from './authSlice';

const useStyles = makeStyles((theme: Theme) => ({
    button: {
        margin: theme.spacing(3)
    }
}));

const Auth: React.FC = () => {
    const classes = useStyles();
    const dispatch: AppDispatch = useDispatch();
    // slice側でexportしたグローバルstate
    const isLoginView = useSelector(selectIsLoginView);
    // このコンポーネントないだけにあるローカルstate
    const [credential, setCredential] = useState({ username: '', password: '' });

    const handeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 実際の入力文字列
        const value = e.target.value;
        // formのname、これをstateのkeyに合わせる
        const name = e.target.name;
        // credentialのstateをバラバラにしてセットする→その後formのnameを持つkeyの値を上書きする
        setCredential({ ...credential, [name]: value });
    };

    const login = async () => {
        if (isLoginView) {
            // ログイン画面の時はログイン実行
            await dispatch(fetchAsyncLogin(credential));
        } else {
            // ユーザー新規作成画面の時はユーザー新規作成
            // ユーザー新規作成が成功していた時
            const result = await dispatch(fetchAsyncRegister(credential));
            if (fetchAsyncRegister.fulfilled.match(result)) {
                // ログイン実行
                await dispatch(fetchAsyncLogin(credential));
                // プロフィール取得
                await dispatch(fetchAsyncCreateProf());
            }
        }
    };

    // 戻り値
    return (
        <div className={styles.auth__root}>
            <h1>{isLoginView ? 'Login' : 'Register'}</h1>
            <br />
            {/* InputLabelProps→ラベルの表示 */}
            <TextField InputLabelProps={{ shrink: true }} label='Username' type='text' name='username' value={credential.username} onChange={handeInputChange} />
            <br />
            <TextField InputLabelProps={{ shrink: true }} label='Password' type='password' name='password' value={credential.password} onChange={handeInputChange} />
            {/* variant='contained'で背景青色の塗りつぶしボタンになる */}
            <Button variant='contained' color='primary' size='small' className={classes.button} onClick={login}>
                {isLoginView ? 'Login' : 'Register'}
            </Button>
            <span onClick={() => dispatch(toggleMode())}>{isLoginView ? 'Create new account ?' : 'Back to login'}</span>
        </div>
    );
};

export default Auth;

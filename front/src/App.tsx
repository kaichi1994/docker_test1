import React, { useEffect } from 'react';
import styles from './App.module.css';
import { Grid, Avatar } from '@material-ui/core';
import { makeStyles, createTheme, MuiThemeProvider, Theme } from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PolymerIcon from '@material-ui/icons/Polymer';

import { useSelector, useDispatch } from 'react-redux';
import { selectLoginUser, selectProfiles, fetchAsyncGetProfs, fetchAsyncUpdateProf, fetchAsyncGetMyProf } from './features/auth/authSlice';
import { fetchAsyncGetTasks, fetchAsyncGetUsers, fetchAsyncGetCategory, selectEditedTask, selectTasks, selectTask } from './features/task/taskSlice';

import TaskList from './features/task/TaskList';
import TaskForm from './features/task/TaskForm';
import TaskDisplay from './features/task/TaskDisplay';
import { AppDispatch } from './app/store';

const theme = createTheme({
    palette: {
        secondary: {
            main: '#3cb371'
        }
    }
});

const useStyles = makeStyles((theme: Theme) => ({
    icon: {
        marginTop: theme.spacing(3),
        cursor: 'none'
    },
    avatar: {
        marginLeft: theme.spacing(1)
    }
}));

const App: React.FC = () => {
    const classes = useStyles();
    const dispatch: AppDispatch = useDispatch();
    // stateの参照
    const editedTask = useSelector(selectEditedTask);
    const loginUser = useSelector(selectLoginUser);
    const profiles = useSelector(selectProfiles);

    // ログインユーザーのプロフィール探索
    const loginProfile = profiles.filter(prof => prof.user_profile === loginUser.id)[0];

    const Logout = () => {
        localStorage.removeItem('localJWT');
        window.location.href = '/';
    };

    const handlerEditPicture = () => {
        const fileInput = document.getElementById('imageInput');
        fileInput?.click();
    };

    /**初回描画時に動く,componentDidMount,データ取得系,第二引数のdispatchは中の関数で使うdispatchを引き渡している */
    useEffect(() => {
        const fetchBootLoader = async () => {
            await dispatch(fetchAsyncGetTasks());
            await dispatch(fetchAsyncGetMyProf());
            await dispatch(fetchAsyncGetUsers());
            await dispatch(fetchAsyncGetCategory());
            await dispatch(fetchAsyncGetProfs());
        };
        fetchBootLoader();
    }, [dispatch]);

    return (
        <MuiThemeProvider theme={theme}>
            <div className={styles.app_root}>
                <Grid container>
                    <Grid item xs={4}>
                        <PolymerIcon className={classes.icon} />
                    </Grid>
                    <Grid item xs={4}>
                        <h1>Scrum Task Board</h1>
                    </Grid>
                    {/* プロフィールエリア */}
                    <Grid item xs={4}>
                        <div className={styles.app__logout}>
                            <button className={styles.app__iconLogout} onClick={Logout}>
                                <ExitToAppIcon fontSize='large' />
                            </button>
                            {/* hiddenのファイルInput */}
                            <input
                                type='file'
                                id='imageInput'
                                hidden={true}
                                onChange={e => {
                                    dispatch(
                                        fetchAsyncUpdateProf({
                                            id: loginProfile.id,
                                            img: e.target.files !== null ? e.target.files[0] : null
                                        })
                                    );
                                }}
                            />
                            {/* プロフィールの画像アイコン */}
                            <button className={styles.app__btn} onClick={handlerEditPicture}>
                                <Avatar className={classes.avatar} alt='avatar' src={loginProfile?.img !== null ? loginProfile?.img : undefined} />
                            </button>
                        </div>
                    </Grid>
                    {/* タスク一覧 */}
                    <Grid item xs={6}>
                        {/* taskリスト */}
                        <TaskList />
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container direction='column' alignItems='center' justifyContent='center' style={{ minHeight: '80vh' }}>
                            <Grid item>
                                {/* 編集taskのstatusがあればtaskForm, なければ(※初期化されている時)taskDisplayを表示 */}
                                {editedTask.status ? <TaskForm /> : <TaskDisplay />}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </MuiThemeProvider>
    );
};

export default App;

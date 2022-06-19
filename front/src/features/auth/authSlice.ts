import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios';
import { AUTH_STATE, CRED, LOGIN_USER, POST_PROFILE, PROFILE, JWT, USER } from '../types';

/**非同期ログイン処理, auth/loginはアクションの名前 */
export const fetchAsyncLogin = createAsyncThunk('auth/login', async (auth: CRED) => {
    // axiosのpostメソッドの返り値をJWT型で指定
    // axiosの第1引数：URL
    // axiosの第2引数：リクエストボディ(※あってもなくてもいい)
    // axiosの第3引数：リクエストヘッダ(※あってもなくてもいい)
    const res = await axios.post<JWT>(`${process.env.REACT_APP_API_URL}/authen/jwt/create`, auth, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return res.data;
});

/**ユーザー新規作成 */
export const fetchAsyncRegister = createAsyncThunk('auth/register', async (auth: CRED) => {
    const res = await axios.post<USER>(`${process.env.REACT_APP_API_URL}/api/create/`, auth, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return res.data;
});

/**ログインユーザーの情報取得 */
export const fetchAsyncGetMyProf = createAsyncThunk('auth/loginuser', async () => {
    const res = await axios.get<LOGIN_USER>(`${process.env.REACT_APP_API_URL}/api/loginuser/`, {
        // ChromeのModHeaderで指定したトークンを設定
        headers: {
            Authorization: `JWT ${localStorage.localJWT}`
        }
    });
    return res.data;
});

/**新規ユーザー作成 */
export const fetchAsyncCreateProf = createAsyncThunk('auth/createProfile', async () => {
    const res = await axios.post<PROFILE>(
        `${process.env.REACT_APP_API_URL}/api/profile/`,
        { img: null },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${localStorage.localJWT}`
            }
        }
    );
    return res.data;
});

/**ユーザー一覧取得 */
export const fetchAsyncGetProfs = createAsyncThunk('auth/getProfiles', async () => {
    const res = await axios.get<PROFILE[]>(`${process.env.REACT_APP_API_URL}/api/profile/`, {
        headers: {
            Authorization: `JWT ${localStorage.localJWT}`
        }
    });
    return res.data;
});

/**プロフィール更新 */
export const fetchAsyncUpdateProf = createAsyncThunk('auth/updateProfile', async (profile: POST_PROFILE) => {
    const uploadData = new FormData();
    // profile.imgがnull出ない時にimgというKeyに画像データ追加
    // append(引数1:key, 引数2:普通の値 or 画像データ, 引数3:画像データ名)
    profile.img && uploadData.append('img', profile.img, profile.img.name);
    const res = await axios.put<PROFILE>(`${process.env.REACT_APP_API_URL}/api/profile/${profile.id}/`, uploadData, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.localJWT}`
        }
    });
    return res.data;
});

/**ログイン画面状態,ログインしているユーザー情報も取得するユーザー一覧情報もなし */
const initialState: AUTH_STATE = {
    isLoginView: true,
    loginUser: {
        id: 0,
        username: ''
    },
    profiles: [{ id: 0, user_profile: 0, img: null }]
};

/**reducer(slice)関連の設定 */
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    // 非同期処理のリクエストなしreducer
    reducers: {
        // ログイン画面とログイン後のタスク画面のフラグ切り替え
        toggleMode(state) {
            state.isLoginView = !state.isLoginView;
        }
    },
    // 各非同期の処理終了後のreducer
    extraReducers: builder => {
        // ログイン処理正常終了
        // action：fetchAsyncLoginのres.dataが返ってくる
        builder.addCase(fetchAsyncLogin.fulfilled, (state, action: PayloadAction<JWT>) => {
            localStorage.setItem('localJWT', action.payload.access);
            // ★()を使うことで&&の後に=のある式が使える
            action.payload.access && (window.location.href = '/tasks');
        });
        // プロフィール取得正常終了
        builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action: PayloadAction<LOGIN_USER>) => {
            return {
                ...state,
                loginUser: action.payload
            };
        });
        builder.addCase(fetchAsyncGetMyProf.rejected, () => {
            alert('失敗している');
        });
        // プロフィール一覧取得正常終了
        builder.addCase(fetchAsyncGetProfs.fulfilled, (state, action: PayloadAction<PROFILE[]>) => {
            return {
                ...state,
                profiles: action.payload
            };
        });
        // プロフィール更新正常終了
        builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action: PayloadAction<PROFILE>) => {
            return {
                ...state,
                // 更新したオブジェクトとIDが一致するもののみ既存のprofilesと入れ替え
                profiles: state.profiles.map(prof => (prof.id === action.payload.id ? action.payload : prof))
            };
        });
    }
});

export const { toggleMode } = authSlice.actions;

// UserSelectorでstateの値を参照する為にexportする
export const selectIsLoginView = (state: RootState) => state.auth.isLoginView;
export const selectLoginUser = (state: RootState) => state.auth.loginUser;
export const selectProfiles = (state: RootState) => state.auth.profiles;

export default authSlice.reducer;

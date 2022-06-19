import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios';
import { READ_TASK, POST_TASK, TASK_STATE, USER, CATEGORY } from '../types';
import { fetchAsyncUpdateProf } from '../auth/authSlice';

/**タスク一覧取得 */
export const fetchAsyncGetTasks = createAsyncThunk('task/getTask', async () => {
    const res = await axios.get<READ_TASK[]>(`${process.env.REACT_APP_API_URL}/api/tasks/`, {
        headers: {
            Authorization: `JWT ${localStorage.localJWT}`
        }
    });
    return res.data;
});

/**ユーザー一覧取得 */
export const fetchAsyncGetUsers = createAsyncThunk('task/getUsers', async () => {
    const res = await axios.get<USER[]>(`${process.env.REACT_APP_API_URL}/api/users/`, {
        headers: {
            Authorization: `JWT ${localStorage.localJWT}`
        }
    });
    return res.data;
});

/**カテゴリー一覧取得 */
export const fetchAsyncGetCategory = createAsyncThunk('task/getCategory', async () => {
    const res = await axios.get<CATEGORY[]>(`${process.env.REACT_APP_API_URL}/api/category/`, {
        headers: {
            Authorization: `JWT ${localStorage.localJWT}`
        }
    });
    return res.data;
});

/**カテゴリー新規作成 */
export const fetchAsyncCreateCategory = createAsyncThunk('task/createCategory', async (item: string) => {
    const res = await axios.post<CATEGORY>(
        `${process.env.REACT_APP_API_URL}/api/category/`,
        { item: item },
        {
            headers: {
                Authorization: `JWT ${localStorage.localJWT}`
            }
        }
    );
    return res.data;
});

/**タスク新規作成 */
export const fetchAsyncCreateTask = createAsyncThunk('task/createTask', async (task: POST_TASK) => {
    const res = await axios.post<READ_TASK>(`${process.env.REACT_APP_API_URL}/api/tasks/`, task, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.localJWT}`
        }
    });
    return res.data;
});

/**タスク更新 */
export const fetchAsyncUpdateTask = createAsyncThunk('task/updateTask', async (task: POST_TASK) => {
    const res = await axios.put<READ_TASK>(`${process.env.REACT_APP_API_URL}/api/tasks/${task.id}/`, task, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.localJWT}`
        }
    });
    return res.data;
});

/**タスク削除 */
export const fetchAsyncDeleteTask = createAsyncThunk('task/deleteTask', async (id: number) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/tasks/${id}/`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.localJWT}`
        }
    });
    return id;
});

/**初期state */
export const initialState: TASK_STATE = {
    tasks: [
        {
            id: 0,
            task: '',
            description: '',
            criteria: '',
            owner: 0,
            owner_username: '',
            responsible: 0,
            responsible_username: '',
            estimate: 0,
            category: 0,
            category_item: '',
            status: '',
            status_name: '',
            created_at: '',
            updated_at: ''
        }
    ],
    editedTask: {
        id: 0,
        task: '',
        description: '',
        criteria: '',
        responsible: 0,
        estimate: 0,
        category: 0,
        status: ''
    },
    selectedTask: {
        id: 0,
        task: '',
        description: '',
        criteria: '',
        owner: 0,
        owner_username: '',
        responsible: 0,
        responsible_username: '',
        estimate: 0,
        category: 0,
        category_item: '',
        status: '',
        status_name: '',
        created_at: '',
        updated_at: ''
    },
    users: [
        {
            id: 0,
            username: ''
        }
    ],
    category: [
        {
            id: 0,
            item: ''
        }
    ]
};

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        // タスク編集画面開いて既存のタスクの値格納
        editTask(state, action: PayloadAction<POST_TASK>) {
            state.editedTask = action.payload;
        },
        // タスク詳細画面開いてい既存のタスクの値格納
        selectTask(state, action: PayloadAction<READ_TASK>) {
            state.selectedTask = action.payload;
        }
    },
    extraReducers: builder => {
        // task取得成功時はtasksのstateにセット
        builder.addCase(fetchAsyncGetTasks.fulfilled, (state, action: PayloadAction<READ_TASK[]>) => {
            return {
                ...state,
                tasks: action.payload
            };
        });
        // task取得失敗時はログイン画面に遷移
        builder.addCase(fetchAsyncGetTasks.rejected, () => {
            window.location.href = '/';
        });
        builder.addCase(fetchAsyncGetUsers.fulfilled, (state, action: PayloadAction<USER[]>) => {
            return {
                ...state,
                users: action.payload
            };
        });
        builder.addCase(fetchAsyncGetCategory.fulfilled, (state, action: PayloadAction<CATEGORY[]>) => {
            return {
                ...state,
                category: action.payload
            };
        });
        builder.addCase(fetchAsyncCreateCategory.fulfilled, (state, action: PayloadAction<CATEGORY>) => {
            return {
                ...state,
                // カテゴリーの末尾に新規追加したカテゴリー追加
                category: [...state.category, action.payload]
            };
        });
        builder.addCase(fetchAsyncCreateTask.fulfilled, (state, action: PayloadAction<READ_TASK>) => {
            return {
                ...state,
                // task一覧の先頭に新規追加したtask追加
                tasks: [action.payload, ...state.tasks],
                // task編集画面の値は初期値に変更
                editedTask: initialState.editedTask
            };
        });
        builder.addCase(fetchAsyncCreateTask.rejected, () => {
            window.location.href = '/';
        });
        builder.addCase(fetchAsyncUpdateTask.fulfilled, (state, action: PayloadAction<READ_TASK>) => {
            return {
                ...state,
                // tasksから更新したtaskIDの一致するもののみ入れ替え
                tasks: state.tasks.map(t => (t.id === action.payload.id ? action.payload : t)),
                editTask: initialState.editedTask,
                selectTask: initialState.selectedTask
            };
        });
        builder.addCase(fetchAsyncUpdateTask.rejected, () => {
            window.location.href = '/';
        });
        builder.addCase(fetchAsyncDeleteTask.fulfilled, (state, action: PayloadAction<number>) => {
            return {
                ...state,
                // tasksから更新したtaskIDの一致するもの以外を検索して格納
                tasks: state.tasks.filter(t => t.id !== action.payload),
                editTask: initialState.editedTask,
                selectTask: initialState.selectedTask
            };
        });
        builder.addCase(fetchAsyncDeleteTask.rejected, () => {
            window.location.href = '/';
        });
    }
});

// taskコンポーネント側で使えるようにreducerをexport
export const { editTask, selectTask } = taskSlice.actions;

// taskコンポーネント側でstateを使えるようにexport
export const selectSelectedTask = (state: RootState) => state.task.selectedTask;
export const selectEditedTask = (state: RootState) => state.task.editedTask;
export const selectTasks = (state: RootState) => state.task.tasks;
export const selectUsers = (state: RootState) => state.task.users;
export const selectCategory = (state: RootState) => state.task.category;

export default taskSlice.reducer;

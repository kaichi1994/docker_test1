import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { TextField, InputLabel, MenuItem, FormControl, Select, Button, Fab, Modal } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';

import { useSelector, useDispatch } from 'react-redux';
import { fetchAsyncCreateTask, fetchAsyncUpdateTask, fetchAsyncCreateCategory, selectUsers, selectEditedTask, selectCategory, editTask, selectTask } from './taskSlice';
import { AppDispatch } from '../../app/store';
import { initialState } from './taskSlice';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme: Theme) => ({
    field: {
        margin: theme.spacing(2),
        minWidth: 240
    },
    button: {
        margin: theme.spacing(3)
    },
    addIcon: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(2)
    },
    saveModal: {
        marginTop: theme.spacing(4),
        marginLeft: theme.spacing(2)
    },
    paper: {
        position: 'absolute',
        textAlign: 'center',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3)
    }
}));

/**モーダルのスタイル設定 */
function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`
    };
}

// React.FC：ReactのFunctionalコンポーネントの型
const TaskForm: React.FC = () => {
    const classes = useStyles();
    const dispatch: AppDispatch = useDispatch();

    // sliceからのグローバルstate取り込み
    const users = useSelector(selectUsers);
    const category = useSelector(selectCategory);
    const editedTask = useSelector(selectEditedTask);

    // モーダル関連
    // モーダルを閉じているか開いているかをローカルstate管理
    const [open, setOpen] = useState(false);
    // モーダルスタイル設定
    const [modalStyle] = useState(getModalStyle);
    // ユーザーの入力情報をローカルstete管理
    const [inputText, setInputText] = useState('');

    // モーダルの開け閉めの関数
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    // 新規追加・更新フォームが更新できる状態かチェック、テキストボックスの必須項目が埋まっているか
    const isDisabled = editedTask.task.length === 0 || editedTask.description.length === 0 || editedTask.criteria.length === 0;

    // カテゴリーも同じく未入力の際は新規追加・更新不可にする
    const isCatDisabled = inputText.length === 0;

    // 文字列入力のテキストボックスの変更イベントを拾う
    const handleInputTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    };

    // 文字列と数値変更のどちらのイベントを拾う
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value: string | number = e.target.value;
        const name = e.target.name;
        if (name === 'estimate') {
            value = Number(value);
        }
        // 変更箇所のnameによって特定のkeyを入力された値で更新
        dispatch(editTask({ ...editedTask, [name]: value }));
    };

    // task担当者プルダウンからの変更を受け取る(※数値)
    const handleSelectRespChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const value = e.target.value as number;
        dispatch(editTask({ ...editedTask, responsible: value }));
    };

    // task作成者プルダウンからの変更を受け取る(※文字列)
    const handleSelectStatusChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const value = e.target.value as string;
        dispatch(editTask({ ...editedTask, status: value }));
    };

    // カテゴリープルダウンからからの変更を受け取る(※数値)
    const handleSelectCatChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const value = e.target.value as number;
        dispatch(editTask({ ...editedTask, category: value }));
    };

    // ユーザーのプルダウン生成
    let userOptions = users.map(user => (
        <MenuItem key={user.id} value={user.id}>
            {user.username}
        </MenuItem>
    ));

    // カテゴリーのプルダウン生成
    let catOptions = category.map(cat => (
        <MenuItem key={cat.id} value={cat.id}>
            {cat.item}
        </MenuItem>
    ));

    return (
        <div>
            <h2>{editedTask.id ? 'Update Task' : 'New Task'}</h2>
            <form>
                {/* 工数のnumberでの入力ボックス */}
                <TextField
                    className={classes.field}
                    label='Estimate [days]'
                    type='number'
                    name='estimate'
                    InputProps={{ inputProps: { min: 0, max: 1000 } }}
                    InputLabelProps={{
                        shrink: true
                    }}
                    value={editedTask.estimate}
                    onChange={handleInputChange}
                />
                {/* task名,InputLabelPropsのshrink:trueを指定することでテキストボックスが開きっぱなし */}
                <TextField
                    className={classes.field}
                    InputLabelProps={{
                        shrink: true
                    }}
                    label='Task'
                    type='text'
                    name='task'
                    value={editedTask.task}
                    onChange={handleInputChange}
                />
                <br />
                {/* 説明 */}
                <TextField
                    className={classes.field}
                    InputLabelProps={{
                        shrink: true
                    }}
                    label='Description'
                    type='text'
                    name='description'
                    value={editedTask.description}
                    onChange={handleInputChange}
                />
                {/* criteria */}
                <TextField
                    className={classes.field}
                    InputLabelProps={{
                        shrink: true
                    }}
                    label='Criteria'
                    type='text'
                    name='criteria'
                    value={editedTask.criteria}
                    onChange={handleInputChange}
                />
                <br />
                {/* ユーザープルダウン */}
                <FormControl className={classes.field}>
                    <InputLabel>Responsible</InputLabel>
                    <Select name='responsible' onChange={handleSelectRespChange} value={editedTask.responsible}>
                        {userOptions}
                    </Select>
                </FormControl>
                {/* ステータスプルダウン */}
                <FormControl className={classes.field}>
                    <InputLabel>Status</InputLabel>
                    <Select name='status' value={editedTask.status} onChange={handleSelectStatusChange}>
                        <MenuItem value={1}>Not started</MenuItem>
                        <MenuItem value={2}>On going</MenuItem>
                        <MenuItem value={3}>Done</MenuItem>
                    </Select>
                </FormControl>
                <br />
                {/* カテゴリープルダウン */}
                <FormControl className={classes.field}>
                    <InputLabel>Category</InputLabel>
                    <Select name='category' value={editedTask.category} onChange={handleSelectCatChange}>
                        {catOptions}
                    </Select>
                </FormControl>
                {/* カテゴリー追加モーダル呼び出し */}
                <Fab size='small' color='primary' onClick={handleOpen} className={classes.addIcon}>
                    <AddIcon />
                </Fab>
                {/* なぜかmodalをコメントアウトしたら動いた */}
                {/* カテゴリー追加モーダル */}
                {/* <Modal open={open} onClose={handleClose}>
                    <div style={modalStyle} className={classes.paper}>
                        <TextField
                            className={classes.field}
                            InputLabelProps={{
                                shrink: true
                            }}
                            label='New category'
                            type='text'
                            value={inputText}
                            onChange={handleInputTextChange}
                        />
                        <Button
                            variant='contained'
                            color='primary'
                            size='small'
                            className={classes.saveModal}
                            startIcon={<SaveIcon />}
                            disabled={isCatDisabled}
                            onClick={() => {
                                // 新規カテゴリー追加
                                dispatch(fetchAsyncCreateCategory(inputText));
                                // モーダル閉じる
                                handleClose();
                            }}
                        >
                            SAVE
                        </Button>
                    </div>
                </Modal> */}
                <br />
                <br />
                {/* task新規追加 or 更新, 更新taskのidが0か0以外かで判断 */}
                <Button
                    variant='contained'
                    color='primary'
                    size='small'
                    className={classes.button}
                    startIcon={<SaveIcon />}
                    disabled={isDisabled}
                    onClick={
                        editedTask.id !== 0
                            ? () => {
                                  dispatch(fetchAsyncUpdateTask(editedTask));
                                  toast('更新に成功しました');
                              }
                            : () => {
                                  dispatch(fetchAsyncCreateTask(editedTask));
                                  toast('新規追加に成功しました');
                              }
                    }
                >
                    {editedTask.id !== 0 ? 'Update' : 'Save'}
                </Button>
                {/* キャンセルボタン */}
                <Button
                    variant='contained'
                    color='default'
                    size='small'
                    onClick={() => {
                        dispatch(editTask(initialState.editedTask));
                        dispatch(selectTask(initialState.selectedTask));
                    }}
                >
                    Cancel
                </Button>
                <ToastContainer />
            </form>
        </div>
    );
};

export default TaskForm;

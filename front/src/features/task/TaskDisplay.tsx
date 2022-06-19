import React from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedTask } from './taskSlice';
import { Button, Avatar, Badge, Table, TableHead, TableCell, TableRow, TableBody, TableSortLabel } from '@material-ui/core';

const TaskDisplay: React.FC = () => {
    // タスク詳細
    const selectedTask = useSelector(selectSelectedTask);

    // 詳細画面の要素リスト
    const rows = [
        { item: 'Task', data: selectedTask.task },
        { item: 'Description', data: selectedTask.description },
        { item: 'Criteria', data: selectedTask.criteria },
        { item: 'Owner', data: selectedTask.owner_username },
        { item: 'Responsible', data: selectedTask.responsible_username },
        { item: 'Estimate [days]', data: selectedTask.estimate },
        { item: 'Category', data: selectedTask.category_item },
        { item: 'Status', data: selectedTask.status_name },
        { item: 'Created', data: selectedTask.created_at },
        { item: 'Updated', data: selectedTask.updated_at }
    ];

    // task詳細のタスク名が空文字であればコンポーネントの戻り値をnullで非表示
    if (!selectedTask.task) {
        return null;
    }
    return (
        <>
            <h2>Task details</h2>
            <Table>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.item}>
                            <TableCell align='center'>
                                <strong>{row.item}</strong>
                            </TableCell>
                            <TableCell align='center'>{row.data}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};

export default TaskDisplay;

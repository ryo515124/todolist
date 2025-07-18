const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Task = require('../models/task');
const { todoSchema } = require('../schema');
const dayjs = require('dayjs');

const taskValidation = (req, res, next) => {
    // if (!req.body) throw new ExpressError('空のデータです', 400);
    const result = todoSchema.validate(req.body);
    // console.log(result);
    if (result.error) {
        console.log('バリデーションエラー', result.error.details);
        throw new ExpressError(result.error.message, 400);
    } else {
        next();
    }
}

router.get('/home', catchAsync(async(req, res) => {
    const tasks = await Task.find({});
    const sort = req.query.sort;
    let sortedTasks = [...tasks];
    
    if (sort === 'time') {
        sortedTasks.sort((a,b) => new Date(a.time) - new Date(b.time));
    } else if (sort === 'created') {
        sortedTasks.sort((a,b) => b._id.getTimestamp() - a._id.getTimestamp());
    }

    sortedTasks.forEach(task => {
        task.formattedTime = task.time
        ? dayjs(task.time).format('YYYY年MM月DD日 HH:mm') :'未設定'
    });

    res.render('tasks/home', { tasks: sortedTasks, sort });
}));

const categories = ['仕事', '勉強','プライベート'];

router.get('/new', catchAsync(async(req, res) => {
    res.render('tasks/new', { categories })
}));

router.post('/', taskValidation, catchAsync(async(req, res, next) => {
    const task = new Task(req.body.task);
    await task.save();
    req.flash('success', 'タスクを追加しました');
    res.redirect(`/tasks/${task._id}`);
}));


router.get('/:id/edit', catchAsync(async(req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id);
    res.render('tasks/edit', { task, categories });
}));

router.put('/:id', taskValidation, catchAsync(async(req, res, next) => {
        console.log(req.body);
        const { id } = req.params;
        const task = await Task.findByIdAndUpdate(id, req.body.task);
        req.flash('success', 'タスクを更新しました')
        res.redirect(`/tasks/${task._id}`);
}));

router.get('/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id);
    res.render('tasks/show', { task });
}));

router.delete('/:id',  catchAsync(async(req, res) => {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    req.flash('error', 'タスクを削除しました')
    res.redirect('/tasks/home');
}));

module.exports = router;
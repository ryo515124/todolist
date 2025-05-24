const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Task = require('./models/task');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const { todoSchema } = require('./schema');
const dayjs = require('dayjs');

mongoose.connect('mongodb://localhost:27017/todolist', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('MongoDBコネクションオッケー');
    })
    .catch(err => {
        console.log('MongoDBコネクションエラー');
        console.log(err);                       //node -i -e "$(< index.js)"
    });

const app = express();

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));

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

const categories = ['仕事', '勉強','プライベート'];

app.get('/tasks/home', catchAsync(async(req, res) => {
    const tasks = await Task.find({});
    res.render('tasks/home', { tasks })
}));

app.get('/tasks/new', catchAsync(async(req, res) => {
    res.render('tasks/new', { categories })
}));

app.post('/tasks', taskValidation, catchAsync(async(req, res, next) => {
    const task = new Task(req.body.task);
    await task.save();
    res.redirect(`/tasks/${task._id}`);
}));


app.get('/tasks/:id/edit', catchAsync(async(req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id);
    res.render('tasks/edit', { task, categories });
}));

app.put('/tasks/:id', taskValidation, catchAsync(async(req, res, next) => {
        console.log(req.body);
        const { id } = req.params;
        const task = await Task.findByIdAndUpdate(id, req.body.task);
        res.redirect(`/tasks/${task._id}`);
}));

app.get('/tasks/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id);
    res.render('tasks/show', { task });
}));

app.delete('/tasks/:id',  catchAsync(async(req, res) => {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.redirect('/tasks/home');
}));

app.use((req, res, next) => {
    next(new ExpressError('ページが見つかりませんでした', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = '問題が発生しました';
    } 
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('ポート3000で待受中');
});
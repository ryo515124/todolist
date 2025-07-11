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

const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/users')

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/todolist';
//'mongodb://localhost:27017/todolist'
mongoose.connect(dbUrl, 
    {   
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
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

const sessionConfig = {
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000*60*60*24*7
    }
};
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes);
app.use('/tasks', taskRoutes);

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

app.get('/',(req, res) => {
    res.redirect('tasks/home');
});

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

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`ポート${port}で待受中`);
});
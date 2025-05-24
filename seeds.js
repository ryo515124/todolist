const mongoose = require('mongoose');
const Schema = require('./models/task');

mongoose.connect('mongodb://localhost:27017/todolist', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('MongoDBコネクションオッケー');
    })
    .catch(err => {
        console.log('MongoDBコネクションエラー');
        console.log(err);                       //node -i -e "$(< index.js)"
    });

const seedTasks = [
    {
        title: '映画見る',
        category: 'プライベート',
        description: '1500円'
    },
    {
        title: '買い物行く',
        category: 'プライベート',
        description: '15時までには帰る'
    },
    {
        title: '本を読む',
        category: '勉強',
        description: '150ページまで'
    }
];

Schema.insertMany(seedTasks)
.then((res => {
    console.log(res);
})).catch(e => {
    console.log(e);
});
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const toDoSchema = new Schema({
    title: String,
    category: String,
    description: String,
    time: Date
});

module.exports = mongoose.model('Task', toDoSchema);
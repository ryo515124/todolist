const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const toDoSchema = new Schema({
    title: String,
    category: String,
    description: String,
    time: Date,
    user: { type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
    },
    done: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Task', toDoSchema);
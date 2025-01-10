const mongoose = require('mongoose');

const { Schema } = mongoose;

const taskssSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        default: "pending"
    },
}, {
    timestamps: true

});

module.exports = mongoose.model('Tasks', taskssSchema)
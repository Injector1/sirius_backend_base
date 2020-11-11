const { nanoid } = require('nanoid')
const { Schema, model } = require('mongoose')

const schema = new Schema ({
    _id: {
        type: String,
        default: () => nanoid(12)
    },
    shortenedUrl: {
        type: String,
        required: true
    },
    urlToShorten: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = model('Link', schema);
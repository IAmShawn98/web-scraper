// Node Packages.
const mongoose = require('mongoose');

// Define This As A Schema. 
const Schema = mongoose.Schema;

// Define Our Article Schema.
var articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    articleDescribe: {
        type: String,
        required: true
    },
    isSaved: {
        type: Boolean,
        default: false
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// Define and Export This Document As Schema Name 'Article'.
var Article = mongoose.model("Article", articleSchema);
// Do Export.
module.exports = Article;
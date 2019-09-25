// Node Packages.
const mongoose = require('mongoose');

// Define This As A Schema.
var Schema = mongoose.Schema;

// Define Our Comment Schema.
var commentSchema = new Schema({
    comment: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
})

// Define and Export This Document As Schema Name 'Comment'.
var Comment = mongoose.model("Comment", commentSchema);
// Do Export.
module.exports = Comment;
const Comment = require('../models/comments');
const Post = require('../models/post');

module.exports.create = function(req, res){
    Post.findById(req.body.post, function(err, post){

        if (post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err, comments){
                // handle error

                post.comments.push(comments);
                post.save();

                res.redirect('/');
            });
        }

    });
}
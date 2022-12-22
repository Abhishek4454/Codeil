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

module.exports.destroy=function(req,res){
    Comment.findById(req.params.id,function(err,comments){
        if(comments.user==req.user.id){
            let postId=comments.post;
            comments.remove();

            Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}},function (err,post) {
                return res.redirect('back');
            })
        }else{
            return res.redirect('back');
        }
    });
}
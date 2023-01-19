const Comment = require('../models/comments');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailers');

// const queue=require('../config/kue');
// const commentEmailWorker=require('../workers/comments_emails_workers');
module.exports.create = async function(req, res){

    try{
        let post = await Post.findById(req.body.post);
        var comment;
        if (post){
             comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();
            
           // comment = await comment.populate('user', 'name email').execPopulate();
            const newComment=await Comment.findById(comment._id).populate('user');
            //console.log(newComment);
            commentsMailer.newComment(newComment);
            // let job =queue.create('emails',newComment).save(function(err){
            //     if(err){
            //         console.log('error in sending to the queue',err);
            //     }

            //     console.log('job enqueued  ..',job.id);
            // })
            if (req.xhr){
            
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
           }


            req.flash('success', 'Comment published!');

            res.redirect('/');
        }
        }catch(err){
        req.flash('error', err);
        return;
    }
    
}


module.exports.destroy = async function(req, res){

    try{
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }


            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}



// module.exports.create = function(req, res){
//     Post.findById(req.body.post, function(err, post){

//         if (post){
//             Comment.create({
//                 content: req.body.content,
//                 post: req.body.post,
//                 user: req.user._id
//             }, function(err, comments){
//                 // handle error

//                 post.comments.push(comments);
//                 post.save();

//                 res.redirect('/');
//             });
//         }

//     });
// }

// module.exports.destroy=function(req,res){
//     Comment.findById(req.params.id,function(err,comments){
//         if(comments.user==req.user.id){
//             let postId=comments.post;
//             comments.remove();

//             Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}},function (err,post) {
//                 return res.redirect('back');
//             })
//         }else{
//             return res.redirect('back');
//         }
//     });
// }
const { response } = require('express');
const User = require('../models/user');
module.exports.profile = function(req, res){
    return res.render('home_view', {
        title: 'User Profile'
    })
}
// module.exports.profile = function(req, res){
//     if (req.cookies.user_id){
//         User.findById(req.cookies.user_id, function(err, user){
//             if (user){
//                 return res.render('home_view', {
//                     title: "User Profile",
//                     user: user
//                 })
//             }else{
//                 return res.redirect('/user/sign-in');

//             }
//         });
//     }else{
//         return res.redirect('/user/sign-in');

//     }
 
// }

//render sign in page
module.exports.signIn = function (req, res) {
    if(req.isAuthenticated()){
        return res.redirect('/user/profile');
    }
    return res.render('user_sign_in', {
        title:"Codeil|user_sign_in"
    })
}

//render sign up page
module.exports.signUp = function (req, res) {
    if(req.isAuthenticated()){
        return res.redirect('/user/profile');
    }
    return res.render('user_sign_up', {
        title: "Codeil|user_sign_up"
    })
}

// get the sign up data
module.exports.create = function (req, res) {
    console.log(req.body);
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }

     User.findOne({ email: req.body.email }, function (err, user) {
        if (err) { console.log('error in finding user in signing up'); return }

        if (!user) {
            User.create(req.body, function (err, user) {
                if (err) { console.log('error in creating user while signing up'); return }

                return res.redirect('/user/user-signIn');
            })
        } else {
            return res.redirect('back');
        }

    });

}

// sign in and create a session for the user
module.exports.createSession = function(req, res){
    return res.redirect('/');
}

// sign out and destroy a session for the user
module.exports.destroySession = function(req, res){
   req.logout();
   return  res.redirect('/');
}


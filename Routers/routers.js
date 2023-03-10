const { Router } = require("express");
const tokenAuth = require("../Authorization/tokenAuth");
const LoginController = require("../Controllers/LoginController");
const SignupController = require("../Controllers/SignupController");
const PostController = require("../Controllers/PostController");
const LikeController = require("../Controllers/LikeController");
const CommentController = require("../Controllers/CommentController");
const UserController = require("../Controllers/UserController");
const router = Router();
router.post("/signup", SignupController.createUser);
router.post("/avatar", SignupController.addProfilePic);
router.post("/login", LoginController.login);
router.post("/createpost", tokenAuth, PostController.createPost);
router.get("/allposts", tokenAuth, PostController.allPosts);
router.get("/mypost", tokenAuth, UserController.myPost);
router.post("/likepost", tokenAuth, LikeController.likePost);
router.post("/commentpost", tokenAuth, CommentController.commentPost);
router.post("/editpost", tokenAuth, PostController.editPost);
router.get("/signout", tokenAuth, UserController.signOut);
router.post("/deletepost", tokenAuth, PostController.deletePost);
router.post("/editprofile", UserController.editProfile);
module.exports = router;

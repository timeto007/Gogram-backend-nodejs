const mongoose = require("mongoose");
const Post = require("../Models/post.model");

const multer = require("multer");

const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({
  storage: Storage,
}).single("Image");

module.exports = {
  /**
   * @swagger
   * components:
   *   schemas:
   *     Post:
   *       type: object
   *       required:
   *         - podtid
   *       properties:
   *         id:
   *           type: string
   *           description: The auto-generated id of the Post
   *         postid:
   *           type: string
   *           description: The uniq id  of Post
   *       example:
   *         postid: fgvjfvhjdfb
   */

  /**
   * @swagger
   * /createpost:
   *   post:
   *     summary: Create new post
   *     tags: [Post]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Post'
   *     responses:
   *       200:
   *         description: The post created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Post'
   *       500:
   *         description: Some server error
   */
  async createPost(req, res) {
    try {
      req.user.password = undefined;
      upload(req, res, (err) => {
        if (err) {
          console.log(err);
        } else {
          const newPost = new Post({
            name: req.body.name,
            image: {
              data: req.file.filename,
              contentType: "image/png",
            },
            description: req.body.description,
            postedBy: req.user,
          });
          newPost
            .save()
            .then(() => res.send(newPost))
            .catch((err) => console.log(err));
        }
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  },
  /**
   * @swagger
   * /allposts:
   *   get:
   *     summary: get all posts
   *     tags: [Post]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Post'
   *     responses:
   *       200:
   *         description: All posts
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Post'
   *       500:
   *         description: Some server error
   */

  async allPosts(req, res) {
    try {
      const allPosts = await Post.find();

      return res.status(200).send({
        message: "All posts",
        data: allPosts,
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  },
  /**
   * @swagger
   * /editposts:
   *   post:
   *     summary: edit a post
   *     tags: [Post]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Post'
   *     responses:
   *       200:
   *         description: Edited successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Post'
   *       500:
   *         description: Some server error
   */
  async editPost(req, res) {
    try {
      const { postid, description } = req.body;

      const postExists = await Post.findById(postid);
      if (!postExists) return res.status(400).send("Post does not exist");

      if (!postExists.likes.length == 0 || !postExists.comments.length == 0) {
        return res.status(400).send("you can't edit liked or commented post");
      }

      const post = await Post.findOne({ _id: postid }).where({
        postedBy: req.user,
      });
      if (!post) return res.status(400).send("Operation not allowed");
      if (post) {
        const editPost = await Post.findByIdAndUpdate(
          postid,
          {
            description: description,
          },
          {
            new: true,
          }
        );
        res.send(editPost);
      } else {
        res.status(422).send({ message: "U cant edit this post" });
      }
    } catch (err) {
      res.send("err");
    }
  },
  /**
   * @swagger
   * /deleteposts:
   *   post:
   *     summary: delete a post
   *     tags: [Post]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Post'
   *     responses:
   *       200:
   *         description: deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Post'
   *       500:
   *         description: Some server error
   */
  async deletePost(req, res) {
    try {
      const { postid } = req.body;

      const postExists = await Post.findById(postid);
      if (!postExists) return res.status(400).send("Post does not exist");

      if (!postExists.likes.length == 0 || !postExists.comments.length == 0) {
        return res.status(400).send("you can't edit liked or commented post");
      }
      const post = await Post.findOne({ _id: postid }).where({
        postedBy: req.user,
      });
      if (!post) return res.status(400).send("Operation not allowed");

      post.remove().then(() => {
        res.json("deleted the post");
      });
    } catch (err) {
      res.send(err);
    }
  },
};

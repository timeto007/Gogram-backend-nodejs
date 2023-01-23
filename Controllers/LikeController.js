const Post = require("../Models/post.model");
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
   * /likepost:
   *   post:
   *     summary: Likea post
   *     tags: [Post]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Post'
   *     responses:
   *       200:
   *         description: The post liked
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Post'
   *       500:
   *         description: Some server error
   */

  async likePost(req, res) {
    const { postid } = req.body;
    const username = req.user.username;

    try {
      const likedPost = await Post.findById(postid);
      if (!likedPost) return res.status(400).send("Post does not exist");

      if (likedPost.likes.includes(username))
        return res.status(400).send("Post already liked");

      likedPost.likes.push(username);
      await likedPost.save();

      return res.status(200).send({
        message: "Post liked",
        likedPost,
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  },
};

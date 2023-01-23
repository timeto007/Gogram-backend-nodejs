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
   * /commentpost:
   *   post:
   *     summary: Add a comment to a post
   *     tags: [Post]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Post'
   *     responses:
   *       200:
   *         description: The post Added successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Post'
   *       500:
   *         description: Some server error
   */

  async commentPost(req, res) {
    const { comment, postid } = req.body;
    const username = req.user.username;

    try {
      const commentPost = await Post.findById(postid);
      if (!commentPost) return res.status(400).send("Post does not exist");

      if (commentPost.comments.includes(username))
        return res.status(400).send("Post already commented");

      commentPost.comments.push({ postedBy: username, comment: comment });
      await commentPost.save();

      return res.status(200).send({
        message: "Post commented",
        commentPost,
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  },
};

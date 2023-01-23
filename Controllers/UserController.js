const Post = require("../Models/post.model");
module.exports = {
  /**
   * @swagger
   * components:
   *   schemas:
   *     User:
   *       type: object
   *       required:
   *         - username
   *         - email
   *         - password
   *       properties:
   *         id:
   *           type: string
   *           description: The auto-generated id of the User
   *         username:
   *           type: string
   *           description: The uniq username of user
   *         password:
   *           type: string
   *           description: The password
   *         email:
   *           type: string
   *           description: The uniq email of user
   *       example:
   *         username: john
   *         email: abc@gmail.com
   *         password: 123eww
   */

  /**
   * @swagger
   * /mypost:
   *   get:
   *     summary: access all of self posts
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       200:
   *         description: The Users posts
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       500:
   *         description: Some server error
   */

  async myPost(req, res) {
    Post.find({ postedBy: req.user._id })
      .then((mypost) => {
        res.json({ mypost });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  /**
   * @swagger
   * /signout:
   *   get:
   *     summary: signout from current session
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       200:
   *         description: successfully signedout
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       500:
   *         description: Some server error
   */

  async signOut(req, res) {
    req.headers = "undefined";
    res.send("signed out successfully");
  },

  /**
   * @swagger
   * /editprofile:
   *   get:
   *     summary: editprofile
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       200:
   *         description: successfully editted the profile
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       500:
   *         description: Some server error
   */

  async editProfile(req, res) {
    const { email, username } = req.body;
    try {
      const userAlreadyExists = await User.findOne({
        username,
      });

      if (userAlreadyExists)
        return res
          .status(400)
          .send({ message: "User already exists. Try a another one" });

      const emailAlreadyExists = await User.findOne({
        email,
      });

      if (emailAlreadyExists) {
        return res
          .status(400)
          .send({ message: "Email already exists. Try sign in" });
      }
    } catch (err) {
      console.log(err);
    }
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          email: email,
          username: username,
        },
        {
          new: true,
        }
      );
      res.send(user);
    } catch (err) {
      res.send(err);
    }
  },
};

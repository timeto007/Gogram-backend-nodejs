const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

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
   * /login:
   *   post:
   *     summary: Login new user
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       200:
   *         description: The User was successfully Logedin
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       500:
   *         description: Some server error
   */

  async login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(422)
        .send({ message: "please add username and password" });
    }

    try {
      const validUsername = await User.findOne({
        username,
      });
      if (!validUsername)
        return res.status(400).send({ message: "User does not exist" });

      const validPassword = await User.findOne({
        password: password,
      }).where({
        username: username,
      });
      if (!validPassword) {
        return res.status(400).send({ message: "Invalid password" });
      }

      var token = jwt.sign({ username: username }, "shhhhh");
      return res.status(200).send({ token });
    } catch (err) {
      return res.status(400).send(err);
    }
  },
};

const User = require("../models/user.model");
const ImageModel = require("../Models/image.model");
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
 * /signup:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The User was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

module.exports = {
  async createUser(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(422).send({ message: "please add all fields" });
    }

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

      const createdUser = await User.create({
        username,
        email,
        password,
      });
      createdUser.password = undefined;

      return res.status(200).send({
        message: "User created successfully",
        data: createdUser,
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  /**
   * @swagger
   * /avatar:
   *   post:
   *     summary: Add a new profile pic
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       200:
   *         description: The profile Added successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       500:
   *         description: Some server error
   */

  async addProfilePic(req, res) {
    const { by } = req.headers;
    console.log(by);
    upload(req, res, (err) => {
      if (err) {
        console.log(err);
      } else {
        const newImage = new ImageModel({
          name: req.body.name,
          image: {
            data: req.file.filename,
            contentType: "image/png",
          },
          by: by,
        });
        newImage
          .save()
          .then(() => res.send("successfully created"))
          .catch((err) => console.log(err));
      }
    });
  },
};

///

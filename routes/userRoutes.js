const express = require("express");
const {
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUserById,
  updateUserByEmail,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.get("/email/:email", getUserByEmail); // ✅ Get user by email
router.post("/", createUser);
router.put("/:id", updateUserById);  // ✅ Update user by ID
router.put("/email/:email", updateUserByEmail);  // ✅ Update user by Email
router.delete("/:id", deleteUser);

module.exports = router;

const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validateRequest");
const auth = require("../middleware/auth");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task CRUD operations
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Buy groceries
 *               description:
 *                 type: string
 *                 example: Milk, Eggs, Bread
 *             required:
 *               - title
 *     responses:
 *       201:
 *         description: Task created.
 */

router.post(
  "/",
  auth,
  [body("title").notEmpty().withMessage("Title is required")],
  validate,
  createTask
);

// Get tasks
router.get("/", auth, getTasks);

// Get task by ID
router.get("/:id", auth, getTasks);

// Update task
router.put("/:id", auth, updateTask);
router.patch("/:id", auth, updateTask);

// Delete task
router.delete("/:id", auth, deleteTask);

module.exports = router;
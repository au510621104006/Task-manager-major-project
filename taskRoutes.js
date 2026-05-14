const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.use(auth);

router.post("/", async (req, res) => {
  const task = await Task.create({
    ...req.body,
    userId: req.user.id,
  });

  res.json(task);
});

router.get("/", async (req, res) => {
  const { search, status, sort } = req.query;

  let query = {
    userId: req.user.id,
  };

  if (search) {
    query.title = {
      $regex: search,
      $options: "i",
    };
  }

  if (status === "completed") {
    query.completed = true;
  }

  if (status === "pending") {
    query.completed = false;
  }

  let sortOption = {};

  if (sort === "latest") {
    sortOption.createdAt = -1;
  }

  if (sort === "oldest") {
    sortOption.createdAt = 1;
  }

  const tasks = await Task.find(query).sort(sortOption);

  res.json(tasks);
});

router.put("/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(task);
});

router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);

  res.json({
    message: "Task deleted",
  });
});

router.patch("/:id/toggle", async (req, res) => {
  const task = await Task.findById(req.params.id);

  task.completed = !task.completed;

  await task.save();

  res.json(task);
});

module.exports = router;
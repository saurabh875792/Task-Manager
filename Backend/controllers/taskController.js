import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find()
        .populate("assignedTo", "name email")
        .populate("projectId", "name");
    } else {
      tasks = await Task.find({ assignedTo: req.user.id })
        .populate("assignedTo", "name email")
        .populate("projectId", "name");
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch tasks", error: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, dueDate, projectId } = req.body;

    if (!title) {
      return res.status(400).json({ msg: "Title is required" });
    }

    // 🔥 IMPORTANT FIX
    if (!assignedTo) {
      return res.status(400).json({ msg: "Please assign task to a user" });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      assignedTo,
      status,
      dueDate,
      projectId,
      createdBy: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ msg: "Failed to create task", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    let task;

    if (req.user.role === "admin") {
      task = await Task.findByIdAndUpdate(id, req.body, { new: true });
    } else {
      task = await Task.findOneAndUpdate(
        { _id: id, assignedTo: req.user.id },
        req.body,
        { new: true }
      );
    }

    if (!task) {
      return res.status(404).json({ msg: "Task not found or unauthorized" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ msg: "Failed to update task", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Only admin can delete tasks" });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.json({ msg: "Task deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Failed to delete task", error: error.message });
  }
};
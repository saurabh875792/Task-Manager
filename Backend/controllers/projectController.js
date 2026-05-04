import Project from "../models/Project.js";

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("members", "name email")
      .populate("createdBy", "name email");

    res.json(projects);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch projects", error: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ msg: "Project name is required" });
    }

    const project = await Project.create({
      name: name.trim(),
      description,
      createdBy: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ msg: "Failed to create project", error: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      req.body,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ msg: "Project not found or unauthorized" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ msg: "Failed to update project", error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOneAndDelete({
      _id: id,
      createdBy: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ msg: "Project not found or unauthorized" });
    }

    res.json({ msg: "Project deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Failed to delete project", error: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    if (!projectId || !userId) {
      return res.status(400).json({ msg: "ProjectId and UserId required" });
    }

    const project = await Project.findOne({
      _id: projectId,
      createdBy: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ msg: "Project not found or unauthorized" });
    }

    const exists = project.members.some(
      (m) => m.toString() === userId.toString()
    );

    if (exists) {
      return res.status(400).json({ msg: "User already a member" });
    }

    project.members.push(userId);
    await project.save();

    res.json({ msg: "Member added successfully", project });
  } catch (error) {
    res.status(500).json({ msg: "Failed to add member", error: error.message });
  }
};
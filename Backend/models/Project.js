import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// 🔥 Index for faster queries
projectSchema.index({ createdBy: 1 });

// 🔥 Prevent duplicate members
projectSchema.methods.addMember = function (userId) {
  const exists = this.members.some(
    (m) => m.toString() === userId.toString()
  );

  if (!exists) {
    this.members.push(userId);
  }
};

const Project = mongoose.model("Project", projectSchema);

export default Project;
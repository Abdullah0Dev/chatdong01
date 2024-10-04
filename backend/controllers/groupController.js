const Group = require("../models/Group");

// Create new message
const createGroup = async (req, res) => {
  try {
    const { name, emoji, desc, background } = req.body;

    if (!name || !emoji || !desc || !background) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    const newGroup = await Group.create({
      name,
      emoji,
      desc,
      background,
    });

    if (!newGroup) {
      return res.status(500).json({ message: "Failed to create group" });
    }

    return res.status(200).json(newGroup);
  } catch (error) { 
    return res
      .status(500)
      .json({ message: "Server error, please try again later" });
  }
};

const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    if (!groups) {
      return res.status(404).json({ message: "No Groups Found" });
    }
    return res.status(200).json(groups);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = { getAllGroups, createGroup };

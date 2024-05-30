const { User, video } = require("../models/index");

const getUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "firstname", "lastname", "username", "email"],
  });

  res.status(200).json({ success: true, data: users });
};

const removeUser = async (req, res) => {
  await User.destroy({
    where: { username: req.params.username },
  });

  res.status(200).json({ success: true, data: {} });
};

const removeVideo = async (req, res) => {
  await Video.destroy({
    where: { id: req.params.id },
  });

  res.status(200).json({ success: true, data: {} });
};

const getVideos = async (req, res) => {
  const videos = await video.findAll({
    attributes: ["id", "title", "description", "url", "thumbnail", "userId"],
  });

  res.status(200).json({ success: true, data: videos });
};

module.exports = {getUsers,removeUser,removeVideo,getVideos}
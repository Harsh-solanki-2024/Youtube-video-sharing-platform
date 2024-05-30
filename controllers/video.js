const { Op } = require("sequelize");
const {
  User,
  video,
  videolike,
  Comment,
  View,
  Subscription,
} = require("../models/index");

const newVideo = async (req, res) => {
  const video = await video.create({
    ...req.body,
    userId: req.params.id,
  });

  res.status(200).json({ success: true, data: video });
};

const getVideo = async (req, res, next) => {
  const video = await video.findByPk(req.params.id, {
    include: [
      {
        model: User,
        attributes: ["id", "username", "avatar"],
      },
    ],
  });

  if (!video) {
    return next({
      message: `No video found for ID - ${req.params.id}`,
      statusCode: 404,
    });
  }

  const comments = await video.getComments({
    order: [["createdAt", "DESC"]],
    attributes: ["id", "text", "createdAt"],
    include: [
      {
        model: User,
        attributes: ["id", "username", "avatar"],
      },
    ],
  });

  const commentsCount = await Comment.count({
    where: {
      videoId: req.params.id,
    },
  });

  const likesCount = await videolike.count({
    where: {
      [Op.and]: [{ videoId: req.params.id }, { like: 1 }],
    },
  });

  const dislikesCount = await videolike.count({
    where: {
      [Op.and]: [{ videoId: req.params.id }, { like: -1 }],
    },
  });

  const views = await View.count({
    where: {
      videoId: req.params.id,
    },
  });;

  const subscribersCount = await Subscription.count({
    where: { subscribeTo: video.userId },
  });


  // likesCount, disLikesCount, views
  video.setDataValue("comments", comments);
  video.setDataValue("commentsCount", commentsCount);
  video.setDataValue("likesCount", likesCount);
  video.setDataValue("dislikesCount", dislikesCount);
  video.setDataValue("views", views);
  video.setDataValue("subscribersCount", subscribersCount);

  res.status(200).json({ success: true, data: video });
};

const searchVideo = async (req, res, next) => {
  if (!req.query.searchterm) {
    return next({ message: "Please enter the searchterm", statusCode: 400 });
  }

  const videos = await video.findAll({
    include: { model: User, attributes: ["id", "avatar", "username"] },
    where: {
      [Op.or]: {
        title: {
          [Op.substring]: req.query.searchterm,
        },
        description: {
          [Op.substring]: req.query.searchterm,
        },
      },
    },
  });

  if (!videos.length)
    return res.status(200).json({ success: true, data: videos });

  videos.forEach(async (video, index) => {
    const views = await View.count({ where: { videoId: video.id } });
    video.setDataValue("views", views);

    if (index === videos.length - 1) {
      return res.status(200).json({ success: true, data: videos });
    }
  });
};

 module.exports = { newVideo,getVideo,searchVideo}
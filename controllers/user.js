const { Op } = require("sequelize");
const { videolike, video, User, subscription, view } = require("../models/index");

const adduser = async(req,res) =>{
   try {
    const addinguser  = await User.create(req.body);
    
   } catch (error) {
      res.json(error)
   }

}

const getFeed = async (req, res, next) => {
  const subscribedTo = await subscription.findAll({
    where: {
      subscriber: req.params.id,
    },
  });

  const subscriptions = subscribedTo.map((sub) => sub.subscribeTo);

  const feed = await video.findAll({
    include: {
      model: User,
      attributes: ["id", "avatar", "username"],
    },
    where: {
      userId: {
        [Op.in]: subscriptions,
      },
    },
    order: [["createdAt", "DESC"]],
  });

  if (!feed.length) {
    return res.status(200).json({ success: true, data: feed });
  }

  feed.forEach(async (video, index) => {
    const views = await view.count({ where: { videoId: video.id } });
    video.setDataValue("views", views);

    if (index === feed.length - 1) {
      return res.status(200).json({ success: true, data: feed });
    }
  });
};

const editUser = async (req, res, next) => {
  await User.update(req.body, {
    where: { id: req.params.id },
  });

  const user = await User.findByPk(req.params.id, {
    attributes: [
      "id",
      "firstname",
      "lastname",
      "username",
      "channelDescription",
      "avatar",
      "cover",
      "email",
    ],
  });

  res.status(200).json({ success: true, data: user });
};

const getProfile = async (req, res, next) => {
  const user = await User.findByPk(req.params.id, {
    attributes: [
      "id",
      "firstname",
      "lastname",
      "username",
      "cover",
      "avatar",
      "email",
      "channelDescription",
    ],
  });

  if (!user) {
    return next({
      message: `No user found for ID - ${req.params.id}`,
      statusCode: 404,
    });
  }

  // subscribersCount
  const subscribersCount = await subscription.count({
    where: { subscribeTo: req.params.id },
  });
  user.setDataValue("subscribersCount", subscribersCount);


  // find the channels this user is subscribed to
  const subscriptions = await subscription.findAll({
    where: { subscriber: req.params.id },
  });
  const channelIds = subscriptions.map((sub) => sub.subscribeTo);

  const channels = await User.findAll({
    attributes: ["id", "avatar", "username"],
    where: {
      id: { [Op.in]: channelIds },
    },
  });

  channels.forEach(async (channel) => {
    const subscribersCount = await subscription.count({
      where: { subscribeTo: channel.id },
    });
    channel.setDataValue("subscribersCount", subscribersCount);
  });

  user.setDataValue("channels", channels);

  const videos = await video.findAll({
    where: { userId: req.params.id },
    attributes: ["id", "thumbnail", "title", "createdAt"],
  });

  if (!videos.length)
    return res.status(200).json({ success: true, data: user });

  videos.forEach(async (video, index) => {
    const views = await view.count({ where: { videoId: video.id } });
    video.setDataValue("views", views);

    if (index === videos.length - 1) {
      user.setDataValue("videos", videos);
      return res.status(200).json({ success: true, data: user });
    }
  });
};

const getLikedVideos = async (req, res, next) => {
  return getVideos(videolike, req, res, next);
};

const getHistory = async (req, res, next) => {
  return getVideos(view, req, res, next);
};

const getVideos = async (model, req, res, next) => {
  const videoRelations = await model.findAll({
    where: { userId: req.params.id },
    order: [["createdAt", "ASC"]],
  });

  const videoIds = videoRelations.map((videoRelation) => videoRelation.videoId);

  const videos = await video.findAll({
    attributes: ["id", "title", "description", "createdAt", "thumbnail", "url"],
    include: {
      model: User,
      attributes: ["id", "username", "avatar"],
    },
    where: {
      id: {
        [Op.in]: videoIds,
      },
    },
  });

  if (!videos.length) {
    return res.status(200).json({ success: true, data: videos });
  }

  videos.forEach(async (video, index) => {
    const views = await view.count({ where: { videoId: video.id } });
    video.setDataValue("views", views);

    if (index === videos.length - 1) {
      return res.status(200).json({ success: true, data: videos });
    }
  });
};

module.exports = {adduser,getFeed,editUser,getProfile,getHistory,getLikedVideos};
const router = require('express').Router();

const {
  adduser,
  getFeed,
  editUser,
  getProfile,
  getLikedVideos,
  getHistory,
} = require("../controllers/user");

const {
    newVideo,
    getVideo,
    searchVideo,
  } = require("../controllers/video");

  const {
    getUsers,
    removeUser,
    getVideos,
    removeVideo,
  } = require("../controllers/admin");



router.get("/feed/:id",getFeed);
router.get("/profile/:id",getProfile);
router.get("/history/:id",getHistory);
router.get('/add/user',adduser);
router.put('/profile/:id',editUser);
router.get('/likevideos/:id',getLikedVideos);

router.post("/  ",newVideo);
router.get("/search", searchVideo);
router.get("/video/:id", getVideo);


router.get("/users", getUsers)
router.get("/videos", getVideos);
router.delete("/users/:username", removeUser);
router.delete("/videos/:id", removeVideo);


module.exports = router

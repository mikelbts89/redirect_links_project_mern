const { Router } = require("express");
const router = Router();
const shortId = require("shortid");
const config = require("../config/default.json");
const Link = require("../Models/Link");
const auth = require("../middleware/auth.middleware");

router.post("/generate", auth, async (req, res) => {
  try {
    const baseUrl = config.baseUrl;
    const { from } = req.body;
    const code = shortId.generate();
    const existing = await Link.findOne({ from });
    if (existing) {
      return res.json({ link: existing });
    }

    const to = baseUrl + "/t/" + code;
    const link = new Link({ code, to, from, owner: req.user.userId });

    await link.save();
    res.status(201).json({ link });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "something goes wrong" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const links = await Link.find({ owner: req.user.userId });
    res.json(links);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "something goes wrong" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    res.json(link);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "something goes wrong" });
  }
});

module.exports = router;

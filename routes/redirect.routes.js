const { Router } = require("express");
const Link = require("../Models/Link");
const router = Router();

router.get("/:code", async (req, res) => {
  try {
    const code = req.params.code;
    const link = await Link.findOne({ code: code });
    if (link) {
      link.clicks++;
      await link.save();
      return res.redirect(link.from);
    }

    res.status(404).json("no link was found");
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "something goes wrong" });
  }
});

module.exports = router;

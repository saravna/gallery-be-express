const models = require("../models");
const path = require("path");
const fs = require("fs");

const uploadMedia = (req, res) => {
  const file = req.files.file;
  const { type } = req.params;
  console.log(file);
  const fileName = req.files.file.name;
  const filePath = `${path.join(__dirname, "..", "public", type)}/${fileName}`;
  console.log(filePath);
  file
    .mv(filePath)
    .then(() => {
      models.Media.create({
        type,
        url: `public/${type}/${fileName}`,
        name: fileName,
      })
        .then((media) => res.status(200).json(media))
        .catch((err) => res.status(400).json({ err }));
    })
    .catch((err) => res.status(400).json({ err }));
};

const getMedia = (req, res) => {
  const { type } = req.params;
  if (type === "photo" || type === "video") {
    models.Media.findAll({
      where: { type },
    }).then((data) => res.status(200).json(data));
  } else {
    res.status(400).json({ err: "Not a valid media type" });
  }
};

const deleteMedia = (req, res) => {
  console.log("hit");
  const { id } = req.params;
  models.Media.findOne({ where: { id } }).then((data) => {
    const filePath = `${path.join(__dirname, "..", "public", data.type)}/${data.name}`;
    console.log(filePath);
    fs.unlinkSync(filePath);
    models.Media.destroy({ where: { id } }).then(() => res.json());
  });
};

module.exports = {
  uploadMedia,
  getMedia,
  deleteMedia,
};

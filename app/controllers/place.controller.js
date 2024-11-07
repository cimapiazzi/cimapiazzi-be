const db = require("../models");
const Place = db.place;
const Op = db.Sequelize.Op;

exports.getPlacesByCompany = (req, res) => {
  Place.findAll({
    where: { companyId: req.params.id }, //Exclude roles admin
  })
    .then((places) => {
      res.status(200).send(places);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.createPlace = (req, res) => {
  // Save User to Database
  Place.create({
    name: req.body.name,
    address: req.body.address,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    googlePlaceId: req.body.googlePlaceId,
    url: req.body.url,
    companyId: req.body.companyId,
    description: req.body.description,
  })
    .then((place) => {
      res.status(201).send({ message: "Luogo aggiunto con successo!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.deletePlace = (req, res) => {
  Place.destroy({
    where: { id: req.params.id },
  })
    .then((deletedCount) => {
      if (deletedCount === 1) {
        res.status(200).send({ message: "Luogo eliminato con successo!" });
      } else {
        res.status(404).send({ message: "Luogo non trovato!" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
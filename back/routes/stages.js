const express = require('express');
const Stage = require('../models/stages');

// const { sessionChecker } = require('../middleware/auth');
const router = express.Router();


router.route('/')
  .get(async (req, res) => {
    const result = await Stage.find({});
    await res.send(result);
  })
  .post(async (req, res) => {
    const { name } = req.body;
    const newStage = new Stage({ name });
    try {
      await newStage.save();
      await res.json({ newStage });
    } catch (error) {
      res.send('Error saving to db');
    }
  });

router.route('/:id')
  .get(async (req, res) => {
    const { id } = req.params;
    const stage = await Stage.findById(id);
    res.json({ stage });
  })
  .put(async (req, res) => {
    const { id } = req.params;
    const update = {
      name: req.body.name
    };
    const updated = await Stage.findOneAndUpdate({ _id: id }, update, { new: true });
    await res.json({ updated });
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    try {
      await Stage.findOneAndDelete({ _id: id });
      await res.json(true);
    } catch (e) {
      await res.json(false);
    }
  });

module.exports = router;

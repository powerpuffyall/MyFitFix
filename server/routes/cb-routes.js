const router = require('express').Router();
require('dotenv').config();
const axios = require('axios');
const { User, Entries, CaloriesIn, CaloriesBurned } = require('../db/index.js');
//const StevenHeErrorLogs = require('Steven He');

//Start variable to set to incoming caloriesBurned number from the API.
//Set it outside th GET and Axios functions so it's not limited by function scope.
let burn = 0;

router.get('/caloriesBurned', (req, res) => {

  const { activity, weight, duration } = req.query;

  const options = {
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/caloriesburned',
    params: { activity: activity, weight: weight, duration: duration },
    headers: {
      'X-Api-Key': process.env.CALORIES_BURNED_API,
    }
  };

  axios.request(options)
    .then(function (response) {
      burn = response.data[0].total_calories;
      res.status(200).send(response.data[0]);
    })
    .catch(function (error) {
      console.error("EMOTIONAL DAAAAMAGE");
      res.sendStatus(500);
    });

})

//POST request to the DB. If entry already exists on given date, it updates it.
//This handles new entries and updating existing entries.
router.post('/caloriesBurned', (req, res) => {
  const { activity, weight, duration, date } = req.body;
  const { _id } = req.user;

  CaloriesBurned.replaceOne({ date: date, user: _id }, {
    activity: activity,
    currentWeight: weight,
    duration: duration,
    caloriesBurned: burn,
    date: date,
    user: _id,
  },
    { upsert: true })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log('Sound like Unemplooyyment', err);
      res.sendStatus(500);
    })
})


//GET from DB to see previous entries and update them
router.get('/caloriesBurned/:date', (req, res) => {
  const { date } = req.params;
  const { _id } = req.user;

  CaloriesBurned.find({ date: date, user: _id })
    .then((dailyEntry) => {
      res.send(dailyEntry);
    })
    .catch((err) => {
      console.log('Failed GET', err);
      res.sendStatus(500);
    })
})


//DELETE entry from DB
router.delete('/caloriesBurned/:date', (req, res) => {
  const { date } = req.params;
  const { _id } = req.user;

  CaloriesBurned.deleteOne({ date: date, user: _id })
    .then(({ deletedCount }) => {
      if (deletedCount) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.log('Failed to DELETE', err);
      res.sendStatus(500);
    })
})

module.exports = router;

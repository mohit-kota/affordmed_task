var express = require("express");
var router = express.Router();
const http = require("http");
const axios = require("axios");

const apiUrl = "http://20.244.56.144/train/trains";

const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODkyMzI2NTMsImNvbXBhbnlOYW1lIjoiU09VVEggUkFJTFdBWSIsImNsaWVudElEIjoiMzQzOThjZDQtOWMyNi00M2Q1LWIwM2QtMjk4ZGM4M2ZmNzMzIiwib3duZXJOYW1lIjoiIiwib3duZXJFbWFpbCI6IiIsInJvbGxObyI6IjIwMDMwMzEyNDMwNiJ9.QB9LiafLROodEG2u8m9Rw3GtD6Xf-yBjLsxECSZfIVw";
const headers = {
  Authorization: `Bearer ${authToken}`,
};

router.get("/", function (req, res, next) {
  const sortTrains = (trains) => {
    // console.log(trainData)
    // Filter trains departing in the next 30 minutes
    const filteredTrains = trains.filter((train) => {
      const currentTimestamp = new Date().getTime();
      const departureTimestamp = new Date().setHours(
        train.departureTime.Hours,
        train.departureTime.Minutes,
        train.departureTime.Seconds
      );
      return departureTimestamp - currentTimestamp > 30 * 60 * 1000;
    });

    // Sort trains based on conditions
    const sortedTrains = filteredTrains.sort((a, b) => {
      // Sort by price (ascending order)
      const priceA = a.price.sleeper;
      const priceB = b.price.sleeper;
      if (priceA !== priceB) {
        return priceA - priceB;
      }

      // Sort by tickets (descending order)
      const ticketsA = a.seatsAvailable.sleeper;
      const ticketsB = b.seatsAvailable.sleeper;
      if (ticketsA !== ticketsB) {
        return ticketsB - ticketsA;
      }

      // Sort by departure time (descending order)
      const departureTimeA = new Date().setHours(
        a.departureTime.Hours,
        a.departureTime.Minutes,
        a.departureTime.Seconds
      );
      const departureTimeB = new Date().setHours(
        b.departureTime.Hours,
        b.departureTime.Minutes,
        b.departureTime.Seconds
      );
      return departureTimeB - departureTimeA;
    });

    return sortedTrains;
  };


  const trainData2 = [];
  
  axios
    .get(apiUrl, { headers })
    .then((response) => {
      
      this.trainData2 = response.data;
      const sortedTrains = sortTrains(response.data);
      
      res.render("index", { trains: sortedTrains });
    })
    .catch((error) => {
      console.error("Error fetching train data:", error);
    });
 
});

module.exports = router;

var express = require("express");
var router = express.Router();
const axios = require("axios");

const apiUrl = "http://20.244.56.144/train/trains";
let authToken = "";
let tokenExpirationTime = 0;

const generateAccessToken = async () => {
  const authApiUrl = "http://20.244.56.144/train/auth";
  const credentials = {
    companyName: "SOUTH RAILWAY",
    clientID: "34398cd4-9c26-43d5-b03d-298dc83ff733",
    ownerName: "MOHIT",
    ownerEmail: "200303124306@paruluniversity.ac.in",
    rollNo: "200303124306",
    clientSecret: "RHBMuEWmaNvhHLIT",
  };

  try {
    const response = await axios.post(authApiUrl, credentials);
    authToken = response.data.access_token;
    tokenExpirationTime = response.data.expires_in;
    setTimeout(generateAccessToken, (tokenExpirationTime - Math.floor(Date.now() / 1000)) * 1000);
  } catch (error) {
    console.error("Error generating access token:", error);
  }
};

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


router.get("/", async function (req, res, next) {
  if (!authToken || Math.floor(Date.now() / 1000) >= tokenExpirationTime) {
   
    await generateAccessToken();
  }

  const headers = {
    Authorization: `Bearer ${authToken}`,
  };

  try {
    const response = await axios.get(apiUrl, { headers });
    const sortedTrains = sortTrains(response.data);
    res.json(sortedTrains);
  } catch (error) {
    console.error("Error fetching train data:", error);
    res.status(500).json({ error: "Error fetching train data" });
  }
});

module.exports = router;

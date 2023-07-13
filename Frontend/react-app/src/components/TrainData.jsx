import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TrainData() {
  const [trainData, setTrainData] = useState([]);

  useEffect(() => {
    fetchTrainData();
  }, []);

  async function fetchTrainData() {
    try {
      const response = await axios.get('http://localhost:3000/');
      const data = response.data;
      setTrainData(data);
    } catch (error) {
      console.error('Error fetching train data:', error);
    }
  }

  return (
    <div>
      <h1>Train Schedule</h1>
      <div className="table-container">
        <table className="train-table">
          <thead>
            <tr>
              <th>Train Name</th>
              <th>Train Number</th>
              <th>Departure Time</th>
              <th>Seats Available</th>
              <th>Price</th>
              <th>Delayed By (minutes)</th>
            </tr>
          </thead>
          <tbody>
            {trainData.map((train, index) => (
              <tr key={index}>
                <td>{train.trainName}</td>
                <td>{train.trainNumber}</td>
                <td>{`${train.departureTime.Hours}:${train.departureTime.Minutes}:${train.departureTime.Seconds}`}</td>
                <td>
                  Sleeper: {train.seatsAvailable.sleeper}, AC: {train.seatsAvailable.AC}
                </td>
                <td>
                  Sleeper: {train.price.sleeper}, AC: {train.price.AC}
                </td>
                <td>{train.delayedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TrainData;

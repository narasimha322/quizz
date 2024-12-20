import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css"; // Import the CSS file

export default function App() {
  const [country, setCountry] = useState("");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);

  async function fetchCountry() {
    try {
      const res = await axios.get("http://localhost:5000/api/quiz");
      setCountry(res.data.country);
      setAnswer("");
    } catch (error) {
      console.error("Error fetching country:", error);
    }
  }

  function resetGame() {
    if (score > highestScore) {
      setHighestScore(score);
    }
    setScore(0);
    fetchCountry();
  }

  async function validateAnswer() {
    try {
      const res = await axios.post("http://localhost:5000/api/quiz/validate", {
        country,
        answer,
      });

      if (res.data.success) {
        setScore(score + 1);
        fetchCountry();
      } else {
        alert(
          `Your highest score is ${highestScore}. You failed! Start again?`
        );
        resetGame();
      }
    } catch (error) {
      console.error("Error validating answer:", error);
    }
  }

  useEffect(() => {
    fetchCountry();
  }, []);

  return (
    <div className="app-container">
      <h1 className="title">World Capitals Quiz</h1>

      <p className="country-display">Country: {country}</p>

      <input
        className="input-field"
        type="text"
        placeholder="Enter Capital"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <br />
      <button className="submit-button" onClick={validateAnswer}>
        Submit
      </button>

      <div className="score-section">
        <p>Score: {score}</p>
        <p>Highest Score: {highestScore}</p>
      </div>
    </div>
  );
}

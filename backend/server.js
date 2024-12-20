import express from "express";
import pkg from "pg"; // Use default import
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

const { Pool } = pkg; // Extract Pool from the default import

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Nani@123",
  port: 5432, // Make sure the port is a number
});

app.use(cors()); // Correct way to use cors middleware
app.use(bodyParser.json());

app.get("/api/quiz", async (req, res) => {
  try {
    const result = await pool.query( // Use await to execute the query asynchronously
      `SELECT country FROM capitals ORDER BY RANDOM() LIMIT 1;`
    );
    res.json({ country: result.rows[0].country }); // Send the country from the result
  } catch (err) {
    console.error(err.message); // Use err to match the catch block
    res.status(500).send("Server Error");
  }
});

app.post("/api/quiz/validate", async(req,res)=>{
    const {country, answer} = req.body;
    try {
        const result = await pool.query(`SELECT capital FROM capitals WHERE country = $1`,[country])
        if (result.rows.length > 0 && result.rows[0].capital.toLowerCase() === answer.toLowerCase()) {
            res.json({success : true, message : "correct"})
        }
        else{
            res.json({success : false, message :"You lost the game try again"})
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error")
    }
})

app.listen(5000, () => console.log("Server running on http://localhost:5000"));

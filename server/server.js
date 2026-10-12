import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dns from "dns";
import dotenv from "dotenv"

//Allowing dotenv to process 
dotenv.config();

// Allowing MongoDB to look for data in global State
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1", "1.0.0.1"]);


const app = express();


// Allowing FrontEnd to connect with backend Code 
app.use(cors());

// Allowing express to Read JSON data
app.use(express.json());


//creating our first App 
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "MERN Task API is Running"
    })
})


//Starting the Server
const port = process.env.port || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server is Running on port: ${port}`)
    })
}


startServer();

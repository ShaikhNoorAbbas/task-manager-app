import express from "express";
import cors from "cors";


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
const port = 5000;


app.listen(port, () => {
    console.log(`Server is Running on port: ${port}`)
})
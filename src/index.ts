import express from "express";
import dotenv from "dotenv";
import setupRoutes from "../src/routes/routes";
import bodyParser from "body-parser";
import cors from 'cors'


const app = express();
dotenv.config();

app.use(cors())
app.use(bodyParser.json());

//INITIALIAING ROUTES
setupRoutes(app);

  
const port = process.env.PORT;

app.listen(port, ()=>{
    console.log(`Server running on PORT - ${port}`);
});
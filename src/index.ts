import express,{Request, Response} from "express";
import dotenv from "dotenv";
// import User from "../src/app/user/index";
import setupRoutes from "../src/routes/routes";
import bodyParser from "body-parser";
const app = express();
dotenv.config();

app.use(bodyParser.json());

//INITIALIAING ROUTES
setupRoutes(app);

  
const port = process.env.PORT;

app.listen(port, ()=>{
    console.log(`Server running on PORT - ${port}`);
});
import express,{Request, Response} from "express";


const app = express();

app.get('/', (req:Request, res:Response) => {
    // Send a response to the client
    res.send('Hello, TypeScript + Node.js + Exp!');
  });
  
  const port = "6001"

app.listen(port, ()=>{
    console.log(`Server running on PORT - ${port}`);
})
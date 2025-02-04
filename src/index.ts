import express,{Request, Response} from "express";


const app = express();

app.use(`/test`, (req:Request, res:Response)=> {
  res.send('<h1>test!</h1>');
})

app.use('/', (req:Request, res:Response) => {
    res.send('<h1>Hello, TypeScript + Node.js + Express!</h1>');
  });


  
  const port = "6001"

app.listen(port, ()=>{
    console.log(`Server running on PORT - ${port}`);
})
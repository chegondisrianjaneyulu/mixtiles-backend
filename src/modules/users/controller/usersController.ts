import express,{Request, Response} from "express";
import { prismaClient } from "../../../clients/db";

const router = express.Router();


router.post("/", async (req: Request, res: Response) => {
    const body = req.body;
    console.log("===============",body)
    // await prismaClient.user.createUser({
    //     data: {
    //         firstName : body.firstName,
    //     }
    // })
    res.send('<h1>test!</h1>');
});

export default router;
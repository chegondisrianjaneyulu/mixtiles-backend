import express, { Request, Response } from "express";
import { prismaClient } from "../../../clients/db";

const router = express.Router();


router.post("/", async (req: Request, res: Response) => {
    try {
        const body = req.body;
        await prismaClient.user.create({
            data: {
                firstName: body?.firstName
            }
        })
        res.send({ message: "User Created Successfully" });
    } catch (error) {
        console.log(error);
        res.send({ error: "something went wrong" });
    }
});

router.post("/auth", async (req, res) => {
    try {
      let body = req.body;
    //   const data = await userService.authUser(body,req);
      res.status(200).send();
    } catch (e) {
      
      console.log("server error", e);
      
    }
  });

export default router;
import express, { Request, Response } from "express";
import { userService } from "../services/userServices";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
      const user = await userService.getAllUsers();
      res.status(201).send(user);
  } catch (e: any) {
      res.status(500).send({ error: e?.message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
      const user = await userService.getUserById(req.params.id);
      res.status(201).send(user);
  } catch (e: any) {
      res.status(500).send({ error: e?.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
      const user = await userService.createUser(req.body);
      res.status(201).send(user);
  } catch (e: any) {
      res.status(500).send({ error: e?.message });
  }
});

router.post("/auth", async (req:Request, res:Response) => {
    try {
      let body = req.body;
      let result = await userService.authenticateUser(body)
      res.status(200).send(result);
    } 
    catch (e:any) {
      console.log('e', e)
      res.status(500).send({error: e?.message})
    }
});

router.put("/users/:id", async (req: Request, res: Response) => {
  try {
      const userId = parseInt(req.params.id);
      const updatedUser = await userService.updateUser(userId, req.body);
      res.status(200).send(updatedUser);
  } catch (e: any) {
      res.status(500).send({ error: e?.message });
  }
});

router.delete("/users/:id", async (req: Request, res: Response) => {
  try {
      const userId = parseInt(req.params.id);
      await userService.deleteUser(userId);
      res.status(200).send({ message: "User deleted successfully." });
  } catch (e: any) {
      res.status(500).send({ error: e?.message });
  }
});


export default router;
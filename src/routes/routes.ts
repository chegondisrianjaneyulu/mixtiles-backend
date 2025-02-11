import { Request,Response } from "express";
import userController from "../modules/users/controller/usersController"


const setupRoutes = async (app: any) => {
    app.use('/api/users', userController);
}


export default setupRoutes;
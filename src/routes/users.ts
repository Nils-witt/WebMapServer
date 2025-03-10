import {Router} from "express";
import {User} from "../models/User";


export const userRouter = Router()

/* GET home page. */
userRouter.get('/', async (req, res, next) => {

    const users: User[] = await User.findAll();
    res.json(users.map((user) => {
        return {
            username: user.username
        }
    }));
});

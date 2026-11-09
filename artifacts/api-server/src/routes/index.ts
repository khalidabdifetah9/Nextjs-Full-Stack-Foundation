import { Router, type IRouter } from "express";
import healthRouter from "./health";
import registerRouter from "./register";
import signInRouter from "./signin";
import sessionRouter from "./session";

const router: IRouter = Router();

router.use(healthRouter);
router.use(registerRouter);
router.use(signInRouter);
router.use(sessionRouter);

export default router;

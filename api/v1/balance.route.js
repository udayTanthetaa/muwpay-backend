import express from "express";
import BalanceController from "./balance.controller.js";

const router = express.Router();

router.route("/token").get(BalanceController.getTokenBalance);

export default router;

import express from "express";
import BalanceController from "./balance.controller.js";

const router = express.Router();

router.route("/wallet").get(BalanceController.getWalletBalance);

export default router;

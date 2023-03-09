import express from "express";
import SwapsController from "./swaps.controller.js";

const router = express.Router();

router.route("/start").post(SwapsController.startSwap);
router.route("/user").get(SwapsController.getSwaps);

export default router;

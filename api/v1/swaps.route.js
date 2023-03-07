import express from "express";
import SwapsController from "./swaps.controller.js";

const router = express.Router();

router.route("/swaps").post(SwapsController.addSwap);

export default router;

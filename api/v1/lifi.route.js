import express from "express";
import LifiController from "./lifi.controller.js";

const router = express.Router();

router.route("/chains").get(LifiController.getChains);
router.route("/tokens").get(LifiController.getTokens);
router.route("/routes").get(LifiController.getRoutes);
router.route("/status").get(LifiController.getStatus);

export default router;

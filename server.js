import express from "express";
import cors from "cors";
import lifi from "./api/v1/lifi.route.js";
import balance from "./api/v1/balance.route.js";
import swaps from "./api/v1/swaps.route.js";
import { sendCustomResponse, sendKeyResponse } from "./responses/index.js";

const app = express();

app.use(
	cors({
		credentials: true,
		origin: true,
	})
);
app.use(express.json());

app.use("/api/v1/lifi", lifi);
app.use("/api/v1/balance", balance);
app.use("/api/v1/swaps", swaps);

// app.use("/", (req, res) => {
// 	sendCustomResponse(res, "SUCCESS", {
// 		greeting: "Welcome to Muwpay's Backend.",
// 	});
// });

app.use("*", (req, res) => {
	sendKeyResponse(res, "INVALID_ROUTE");
});

export default app;

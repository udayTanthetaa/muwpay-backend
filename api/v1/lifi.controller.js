import LifiDAO from "../../dao/lifiDAO.js";
import { sendKeyResponse, sendCustomResponse } from "../../responses/index.js";

export default class LifiController {
	static isTestnetValid = (isTestnet) => {
		if (isTestnet === undefined || (isTestnet !== "true" && isTestnet !== "false")) {
			return false;
		} else {
			return true;
		}
	};

	static isRouteRequestValid = (
		fromChainId,
		toChainId,
		fromTokenAddress,
		toTokenAddress,
		fromAddress,
		fromAmount
	) => {
		if (
			fromChainId === undefined ||
			toChainId === undefined ||
			fromTokenAddress === undefined ||
			toTokenAddress === undefined ||
			fromAddress === undefined ||
			fromAmount === undefined
		) {
			return false;
		} else {
			return true;
		}
	};

	static getChains = async (req, res) => {
		try {
			const isTestnet = req.query.isTestnet;

			if (!this.isTestnetValid(isTestnet)) {
				sendKeyResponse(res, "INVALID_TESTNET");
				return;
			}

			const chains = await LifiDAO.getChains({
				isTestnet: isTestnet,
			});

			if (chains.status === "SUCCESS") {
				if (chains.chains === undefined) {
					sendKeyResponse(res, "SOMETHING_WENT_WRONG");
				} else {
					sendCustomResponse(res, "SUCCESS", {
						chains: chains.chains,
					});
				}
			} else {
				sendKeyResponse(res, chains.status);
			}
		} catch (err) {
			sendKeyResponse(res, "SOMETHING_WENT_WRONG");
		}
	};

	static getTokens = async (req, res) => {
		try {
			const isTestnet = req.query.isTestnet;
			const chainId = req.query.chainId;

			if (!this.isTestnetValid(isTestnet)) {
				sendKeyResponse(res, "INVALID_TESTNET");
				return;
			}

			const tokens = await LifiDAO.getTokens({
				isTestnet: isTestnet,
				chainId: chainId,
			});

			if (tokens.status === "SUCCESS") {
				if (tokens.tokens === undefined) {
					sendKeyResponse(res, "INVALID_CHAIN");
				} else {
					sendCustomResponse(res, tokens.status, {
						tokens: tokens.tokens,
					});
				}
			} else {
				sendKeyResponse(res, tokens.status);
			}
		} catch (err) {
			sendKeyResponse(res, "SOMETHING_WENT_WRONG");
		}
	};

	static getRoutes = async (req, res) => {
		try {
			const isTestnet = req.query.isTestnet;
			const fromChainId = req.query.fromChainId;
			const toChainId = req.query.toChainId;
			const fromTokenAddress = req.query.fromTokenAddress;
			const toTokenAddress = req.query.toTokenAddress;
			const fromAddress = req.query.fromAddress;
			const fromAmount = req.query.fromAmount;

			if (!this.isTestnetValid(isTestnet)) {
				sendKeyResponse(res, "INVALID_TESTNET");
				return;
			}

			if (
				!this.isRouteRequestValid(
					fromChainId,
					toChainId,
					fromTokenAddress,
					toTokenAddress,
					fromAddress,
					fromAmount
				)
			) {
				sendKeyResponse(res, "BAD_REQUEST");
				return;
			}

			const routes = await LifiDAO.getRoutes({
				isTestnet,
				fromChainId,
				toChainId,
				fromTokenAddress,
				toTokenAddress,
				fromAddress,
				fromAmount,
			});

			if (routes.status === "ERROR") {
				sendCustomResponse(res, "INTERNAL_SERVER_ERROR", {
					error: routes.error,
				});
			} else {
				if (routes.routes.length === 0) {
					sendKeyResponse(res, "NO_ROUTES");
				} else {
					sendCustomResponse(res, "SUCCESS", {
						routes: routes.routes,
					});
				}
			}
		} catch (err) {
			sendKeyResponse(res, "SOMETHING_WENT_WRONG");
		}
	};
}

// Route Exist (Mainnet)
// 1 -> 137
// 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
// -> 0x2791bca1f2de4661ed88a30c99a7a9449aa84174
// 0x069D9dE7371E16F8E3CADB4B0eafFF40cd977A00
// 10000000000000000

// Route Exist (Testnet)
// 5 -> 5
// 0x0000000000000000000000000000000000000000
// -> 0xd87ba7a50b2e7e660f678a895e4b72e7cb4ccd9c
// 0x069D9dE7371E16F8E3CADB4B0eafFF40cd977A00
// 10000000000000

// Route Not Exist
// 5 -> 80001
// 0x0000000000000000000000000000000000000000
// -> 0x0000000000000000000000000000000000000000

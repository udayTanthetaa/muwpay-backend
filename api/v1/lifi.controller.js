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

	static isStatusRequestValid = (bridge, fromChain, toChain, txHash) => {
		if (bridge === undefined || fromChain === undefined || toChain === undefined || txHash === undefined) {
			return false;
		} else {
			return true;
		}
	};

	static createOldStepMap = ({ routes }) => {
		const getDirection = {
			0: "down",
			1: "right",
			2: "down",
			3: "left",
		};

		let stepMaps = [];

		for (let i = 0; i < routes.length; i++) {
			let isInitial = true;
			let stepMap = [];
			let stepCounter = 0;

			for (let j = 0; j < routes[i].steps.length; j++) {
				for (let k = 0; k < routes[i].steps[j].includedSteps.length; k++) {
					if (isInitial === true) {
						stepMap.push({
							type: "token",
							name: routes[i].steps[j].includedSteps[k].action.fromToken.symbol,
							logoURI: routes[i].steps[j].includedSteps[k].action.fromToken.logoURI,
							chainId: routes[i].steps[j].includedSteps[k].action.fromToken.chainId,
						});

						// stepMap.push({
						// 	type: "direction",
						// 	name: getDirection[stepCounter % 4],
						// });

						stepCounter = stepCounter + 1;

						stepMap.push({
							type: "tool",
							name: routes[i].steps[j].includedSteps[k].toolDetails.name,
							logoURI: routes[i].steps[j].includedSteps[k].toolDetails.logoURI,
						});

						// stepMap.push({
						// 	type: "direction",
						// 	name: getDirection[stepCounter % 4],
						// });

						stepCounter = stepCounter + 1;

						stepMap.push({
							type: "token",
							name: routes[i].steps[j].includedSteps[k].action.toToken.symbol,
							logoURI: routes[i].steps[j].includedSteps[k].action.toToken.logoURI,
							chainId: routes[i].steps[j].includedSteps[k].action.toToken.chainId,
						});

						isInitial = false;
					} else {
						// stepMap.push({
						// 	type: "direction",
						// 	name: getDirection[stepCounter % 4],
						// });

						stepCounter = stepCounter + 1;

						stepMap.push({
							type: "tool",
							name: routes[i].steps[j].includedSteps[k].toolDetails.name,
							logoURI: routes[i].steps[j].includedSteps[k].toolDetails.logoURI,
						});

						// stepMap.push({
						// 	type: "direction",
						// 	name: getDirection[stepCounter % 4],
						// });

						stepCounter = stepCounter + 1;

						stepMap.push({
							type: "token",
							name: routes[i].steps[j].includedSteps[k].action.toToken.symbol,
							logoURI: routes[i].steps[j].includedSteps[k].action.toToken.logoURI,
							chainId: routes[i].steps[j].includedSteps[k].action.toToken.chainId,
						});
					}
				}
			}

			stepMaps.push(stepMap);
		}

		return stepMaps;
	};

	static createRawStepMap = ({ routes }) => {
		const getDirection = {
			0: "down",
			1: "right",
			2: "down",
			3: "left",
		};

		let stepMaps = [];

		for (let i = 0; i < routes.length; i++) {
			let isInitial = true;
			let stepMap = [];
			let stepCounter = 0;

			for (let j = 0; j < routes[i].steps.length; j++) {
				for (let k = 0; k < routes[i].steps[j].includedSteps.length; k++) {
					if (isInitial === true) {
						stepMap.push({
							type: "token",
							name: routes[i].steps[j].includedSteps[k].action.fromToken.symbol,
							logoURI: routes[i].steps[j].includedSteps[k].action.fromToken.logoURI,
							chainId: routes[i].steps[j].includedSteps[k].action.fromToken.chainId,
						});

						stepMap.push({
							type: "direction",
							name: getDirection[stepCounter % 4],
						});

						stepCounter = stepCounter + 1;

						stepMap.push({
							type: "tool",
							name: routes[i].steps[j].includedSteps[k].toolDetails.name,
							logoURI: routes[i].steps[j].includedSteps[k].toolDetails.logoURI,
						});

						stepMap.push({
							type: "direction",
							name: getDirection[stepCounter % 4],
						});

						stepCounter = stepCounter + 1;

						stepMap.push({
							type: "token",
							name: routes[i].steps[j].includedSteps[k].action.toToken.symbol,
							logoURI: routes[i].steps[j].includedSteps[k].action.toToken.logoURI,
							chainId: routes[i].steps[j].includedSteps[k].action.toToken.chainId,
						});

						isInitial = false;
					} else {
						stepMap.push({
							type: "direction",
							name: getDirection[stepCounter % 4],
						});

						stepCounter = stepCounter + 1;

						stepMap.push({
							type: "tool",
							name: routes[i].steps[j].includedSteps[k].toolDetails.name,
							logoURI: routes[i].steps[j].includedSteps[k].toolDetails.logoURI,
						});

						stepMap.push({
							type: "direction",
							name: getDirection[stepCounter % 4],
						});

						stepCounter = stepCounter + 1;

						stepMap.push({
							type: "token",
							name: routes[i].steps[j].includedSteps[k].action.toToken.symbol,
							logoURI: routes[i].steps[j].includedSteps[k].action.toToken.logoURI,
							chainId: routes[i].steps[j].includedSteps[k].action.toToken.chainId,
						});
					}
				}
			}

			stepMaps.push(stepMap);
		}

		return stepMaps;
	};

	static createNewStepMap = ({ stepMaps }) => {
		let newStepMaps = [];

		for (let j = 0; j < stepMaps.length; j++) {
			const stepMap = stepMaps[j];

			const gap = {
				type: "gap",
				name: "",
			};

			let newStepMap = [];
			let prevDirection = "left";
			let i = 0;

			while (i < stepMap.length) {
				let currStep = stepMap[i];

				if (currStep.type === "token") {
					if (prevDirection === "left") {
						newStepMap.push(currStep);
						newStepMap.push(gap);
						newStepMap.push(gap);
						i += 1;
					} else {
						newStepMap.push(currStep);
						newStepMap.push(gap);
						newStepMap.push(gap);
						i += 1;
					}
				} else if (currStep.type === "direction" && currStep.name === "down") {
					if (prevDirection === "left") {
						newStepMap.push(currStep);
						newStepMap.push(gap);
						newStepMap.push(gap);
						i += 1;
					} else {
						newStepMap.push(currStep);
						i += 1;
					}
				} else if (currStep.type === "tool") {
					if (prevDirection === "left") {
						newStepMap.push(currStep);
						i += 1;
					} else {
						let futureStep = i + 2;
						let futureDirection = i + 1;

						newStepMap.push(stepMap[futureStep]);
						newStepMap.push(stepMap[futureDirection]);
						newStepMap.push(currStep);

						i += 3;

						prevDirection = "left";
					}
				} else if (currStep.type === "direction" && currStep.name === "right") {
					prevDirection = currStep.name;
					newStepMap.push(currStep);
					i += 1;
				}
			}

			newStepMaps.push(newStepMap);
		}

		return newStepMaps;
	};

	static getChains = async (req, res) => {
		try {
			console.log("Chain API Called");

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
				console.log(err);
				sendKeyResponse(res, chains.status);
			}
		} catch (err) {
			console.log(err);
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
					const oldStepMaps = this.createOldStepMap({ routes: routes.routes });
					const rawStepMaps = this.createRawStepMap({ routes: routes.routes });
					const newStepMaps = this.createNewStepMap({ stepMaps: rawStepMaps });

					sendCustomResponse(res, "SUCCESS", {
						routes: routes.routes,
						stepMaps: oldStepMaps,
						newStepMaps: newStepMaps,
					});
				}
			}
		} catch (err) {
			sendKeyResponse(res, "SOMETHING_WENT_WRONG");
		}
	};

	static getStatus = async (req, res) => {
		try {
			const isTestnet = req.query.isTestnet;
			const bridge = req.query.bridge;
			const fromChain = req.query.fromChain;
			const toChain = req.query.toChain;
			const txHash = req.query.txHash;

			if (!this.isTestnetValid(isTestnet)) {
				sendKeyResponse(res, "INVALID_TESTNET");
				return;
			}

			if (!this.isStatusRequestValid(bridge, fromChain, toChain, txHash)) {
				sendKeyResponse(res, "INVALID_STATUS_REQUEST");
				return;
			}

			const result = await LifiDAO.getStatus({
				isTestnet: isTestnet,
				bridge: bridge,
				fromChain: fromChain,
				toChain: toChain,
				txHash: txHash,
			});

			if (result.status === "ERROR") {
				sendCustomResponse(res, "INTERNAL_SERVER_ERROR", {
					error: result.error,
				});
			} else {
				sendCustomResponse(res, "SUCCESS", {
					data: result.data,
				});
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

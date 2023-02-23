import AlchemyDAO from "../../dao/alchemyDAO.js";
import { ethers } from "ethers";
import { sendKeyResponse, sendCustomResponse } from "../../responses/index.js";
import { chains } from "../../constants/index.js";

export default class BalanceController {
	static getTokenBalance = async (req, res) => {
		const address = req.query.address;
		const chainId = req.query.chainId;

		if (chainId === undefined || !Number.isInteger(parseInt(chainId)) || chains[chainId] === undefined) {
			sendKeyResponse(res, "INVALID_CHAIN");
			return;
		}

		if (address === undefined || !ethers.isAddress(address)) {
			sendKeyResponse(res, "INVALID_ADDRESS");
			return;
		}

		if (chains[chainId].api === "ALCHEMY") {
			const result = await AlchemyDAO.getTokenBalance({
				chainId,
				name: chains[chainId].name,
				address: address,
			});

			if (result.status === "SUCCESS") {
				sendCustomResponse(res, result.status, {
					address: address,
					valueUSD: result.valueUSD,
					tokens: result.balances,
				});
			} else if (result.status === "NO_BALANCE") {
				sendKeyResponse(res, result.status, {
					address: address,
				});
			} else {
				sendCustomResponse(res, result.status, {
					error: result.error,
				});
			}
		} else {
			sendKeyResponse(res, "INVALID_CHAIN");
		}
	};
}

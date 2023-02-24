import BalanceDAO from "../../dao/balanceDAO.js";
import { ethers } from "ethers";
import { sendKeyResponse, sendCustomResponse } from "../../responses/index.js";

export default class BalanceController {
	static getWalletBalance = async (req, res) => {
		try {
			const address = req.query.address;
			const chainId = req.query.chainId;

			if (chainId === undefined || !Number.isInteger(parseInt(chainId))) {
				sendKeyResponse(res, "INVALID_CHAIN");
				return;
			}

			if (address === undefined || !ethers.isAddress(address)) {
				sendKeyResponse(res, "INVALID_ADDRESS");
				return;
			}

			const result = await BalanceDAO.getWalletBalance({
				chainId,
				address: address,
			});

			if (result.status === "SUCCESS") {
				sendCustomResponse(res, result.status, {
					address: address,
					valueUSD: result.valueUSD,
					native: result.native,
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
		} catch (err) {
			sendKeyResponse(res, "SOMETHING_WENT_WRONG");
		}
	};
}

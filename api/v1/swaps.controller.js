import SwapsDAO from "../../dao/swapsDAO.js";
import { sendKeyResponse, sendCustomResponse } from "../../responses/index.js";
import { ethers } from "ethers";

export default class SwapsController {
	static startSwap = async (req, res) => {
		try {
			const id = req.body.id;

			if (id === undefined) {
				sendKeyResponse(res, "BAD_REQUEST");
				return;
			}

			await SwapsDAO.startSwap(id, res);
		} catch (err) {
			sendKeyResponse(res, "SOMETHING_WENT_WRONG");
		}
	};

	static getSwaps = async (req, res) => {
		try {
			const address = req.query.address;

			if (!address || !ethers.isAddress(address)) {
				sendKeyResponse(res, "BAD_REQUEST");
				return;
			}

			await SwapsDAO.getSwaps(address, res);
		} catch (err) {
			sendKeyResponse(res, "SOMETHING_WENT_WRONG");
		}
	};
}

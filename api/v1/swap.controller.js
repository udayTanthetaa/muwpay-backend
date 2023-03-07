import SwapsDAO from "../../dao/swapsDAO.js";
import { sendKeyResponse, sendCustomResponse } from "../../responses/index.js";

export default class SwapsController {
	static addSwap = async (req, res) => {
		try {
			const id = req.body.id;

			if (id === undefined) {
				sendKeyResponse(res, "BAD_REQUEST");
				return;
			}

			await SwapsDAO.addSwap(id, res);
		} catch (err) {
			sendKeyResponse(res, "SOMETHING_WENT_WRONG");
		}
	};
}

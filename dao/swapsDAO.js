import mongodb from "mongodb";
import { sendKeyResponse, sendCustomResponse } from "../responses/index.js";

let swaps;

export default class SwapsDAO {
	static injectDB = async (conn) => {
		if (swaps) {
			return;
		}

		try {
			swaps = await conn.db(process.env.MUWPAY_NS).collection("swaps");
		} catch (err) {
			console.error(`Unable to establish connection handle in usersDAO => ${err}`);
		}
	};

	static addSwap = async (id, res) => {
		try {
			const swapExists = await swaps.findOne({
				_id: id,
			});

			if (!swapExists) {
				sendKeyResponse(res, "SWAP_NOT_FOUND");
				return;
			}

			await swaps.updateOne(
				{
					_id: id,
				},
				{
					$set: {
						started: "TRUE",
					},
				}
			);

			sendKeyResponse(res, "SUCCESS");
		} catch (err) {
			sendKeyResponse(res, "INTERNAL_SERVER_ERROR");
		}
	};
}

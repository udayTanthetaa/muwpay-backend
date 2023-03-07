import app from "./server.js";
import dotenv from "dotenv";
import mongodb from "mongodb";
import LifiDAO from "./dao/lifiDAO.js";
import SwapsDAO from "./dao/swapsDAO.js";

const main = async () => {
	dotenv.config();

	const port = process.env.PORT || 8000;

	const client = new mongodb.MongoClient(process.env.MUWPAY_DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	try {
		await client.connect();

		await LifiDAO.injectDB(client);
		await SwapsDAO.injectDB(client);

		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

main().catch(console.error);

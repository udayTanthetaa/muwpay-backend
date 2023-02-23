import app from "./server.js";
import dotenv from "dotenv";

const main = async () => {
	dotenv.config();

	const port = process.env.PORT || 8000;

	try {
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

main().catch(console.error);

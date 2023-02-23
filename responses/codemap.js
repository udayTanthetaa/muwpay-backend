export const Codemap = {
	SUCCESS: {
		code: 201,
		message: "Success",
	},
	UPDATED: {
		code: 201,
		message: "Successfully Updated",
	},
	EMAIL_SENT: {
		code: 201,
		message: "Check you email + click on link to complete the verification process.",
	},
	SIGN_IN_SUCCESS: {
		code: 201,
		message: "Sign In Success",
	},
	SIGN_UP_SUCCESS: {
		code: 201,
		message: "Account Created",
	},

	UNAUTHORIZED: {
		code: 401,
		message: "Unauthorized",
	},
	INVALID_AUTH_TOKEN: {
		code: 401,
		message: "Invalid Auth Token",
	},
	WRONG_PASSWORD: {
		code: 401,
		message: "Incorrect Password",
	},

	INVALID_TESTNET: {
		code: 400,
		message: "Value of isTestnet is Invalid",
	},
	INVALID_CHAIN: {
		code: 400,
		message: "Chain Id is Invalid",
	},
	BAD_REQUEST: {
		code: 400,
		message: "Bad Request",
	},
	INVALID_EMAIL: {
		code: 400,
		message: "Invalid Email",
	},
	INVALID_USERNAME: {
		code: 400,
		message: "Invalid Username",
	},
	INVALID_PASSWORD: {
		code: 400,
		message: "Invalid Password",
	},

	AUTH_TOKEN_MISSING: {
		code: 404,
		message: "Auth Token Missing",
	},
	USER_NOT_FOUND: {
		code: 404,
		message: "User Not Found",
	},
	NO_ROUTES: {
		code: 404,
		message: "No Routes Available",
	},

	USERNAME_CONFLICT: {
		code: 409,
		message: "Username Already Taken",
	},
	EMAIL_CONFLICT: {
		code: 409,
		message: "Email Already Taken",
	},

	INVALID_ROUTE: {
		code: 421,
		message: "Invalid Route",
	},

	EMAIL_FAILED: {
		code: 500,
		message: "Failed To Send Email",
	},
	INTERNAL_SERVER_ERROR: {
		code: 500,
		message: "Internal Server Error",
	},
	SOMETHING_WENT_WRONG: {
		code: 500,
		message: "Something Went Wrong",
	},
};

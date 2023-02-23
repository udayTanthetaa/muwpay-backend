import { Alchemy, Network } from "alchemy-sdk";
import dotenv from "dotenv";
import { chains } from "../constants/index.js";

dotenv.config();

export default class AlchemyDAO {
	static getTokenBalance = async ({ chainId, name, address }) => {
		try {
			let addressBalance = [];
			let valueUSD = parseFloat(0);
			let balances = [];

			const config = {
				apiKey: process.env.ALCHEMY_API_KEY,
				network: name,
			};

			const alchemy = new Alchemy(config);

			const requestAllTokens = await fetch(`https://li.quest/v1/tokens`, {
				method: "GET",
				headers: { accept: "application/json" },
			});

			const allTokens = await requestAllTokens.json();
			const tokens = allTokens.tokens[chainId];

			const tokenContractAddresses = tokens.map((token) => token.address);
			const tokenContractAddressesLength = tokenContractAddresses.length;
			const tokenContractAddressesLimit = 1500;
			const apiCallsRequired = Math.ceil(tokenContractAddressesLength / tokenContractAddressesLimit);

			for (let i = 1; i <= apiCallsRequired; i++) {
				let startIndex = tokenContractAddressesLimit * (i - 1);
				let endIndex = tokenContractAddressesLimit * i;

				if (endIndex > tokenContractAddressesLength) {
					endIndex = tokenContractAddressesLength;
				}

				let currTokenContractAddresses = tokenContractAddresses.slice(startIndex, endIndex);

				let currBalances = await alchemy.core.getTokenBalances(address, currTokenContractAddresses);

				currBalances = currBalances.tokenBalances.map((thisToken) => parseInt(thisToken.tokenBalance, 16));
				balances = balances.concat(currBalances);
			}

			for (let i = 0; i < tokenContractAddressesLength; i++) {
				if (balances[i] !== 0 && Number.isInteger(parseInt(balances[i]))) {
					let thisTokenBalance = balances[i] / Math.pow(10, tokens[i].decimals);
					let thisValueUSD = thisTokenBalance * parseFloat(tokens[i].priceUSD);

					valueUSD += thisValueUSD;

					addressBalance.push({
						...tokens[i],
						balance: thisTokenBalance,
						valueUSD: thisValueUSD,
					});
				}
			}

			// const balances = await alchemy.core.getTokenBalances(address, tokenContractAddresses);

			// =================================

			// const balances = await alchemy.core.getTokenBalances(address);
			// const nonZeroBalances = balances.tokenBalances.filter((token) => {
			// 	return token.tokenBalance != "0";
			// });

			// for (let token of nonZeroBalances) {
			// 	let balance = token.tokenBalance;
			// 	const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);

			// 	balance = balance / Math.pow(10, metadata.decimals);

			// 	if (metadata.logo !== null && balance !== 0) {
			// 		addressBalance.push({
			// 			...metadata,
			// 			contractAddress: token.contractAddress,
			// 			balance,
			// 		});
			// 	}
			// }

			if (addressBalance.length === 0) {
				return {
					status: "NO_BALANCE",
				};
			} else {
				return {
					status: "SUCCESS",
					valueUSD: valueUSD,
					balances: addressBalance,
				};
			}
		} catch (err) {
			console.log(err);
			return {
				status: "INTERNAL_SERVER_ERROR",
				error: err,
			};
		}
	};
}

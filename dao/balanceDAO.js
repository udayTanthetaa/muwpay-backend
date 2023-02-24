import { erc20ABI } from "../constants/index.js";
import { ethers } from "ethers";

export default class BalanceDAO {
	static getWalletBalance = async ({ chainId, address }) => {
		try {
			// initial variables
			let native;
			let addressBalance = [];
			let valueUSD = parseFloat(0);

			// fetching all tokens
			const requestAllTokens = await fetch(`https://li.quest/v1/tokens`, {
				method: "GET",
				headers: { accept: "application/json" },
			});
			const allTokens = await requestAllTokens.json();
			const tokens = allTokens.tokens[chainId];

			// invalid chain condition
			if (tokens === undefined) {
				return {
					status: "INVALID_CHAIN",
				};
			}

			// fetching all chains
			const requestAllChains = await fetch(`https://li.quest/v1/chains`, {
				method: "GET",
				headers: { accept: "application/json" },
			});
			const allChains = await requestAllChains.json();
			const chains = allChains.chains;

			// setting current chain details
			let chain = chains.filter((chain) => chain.id == chainId)[0];

			// setting provider for given chain
			const provider = new ethers.JsonRpcProvider(chain.metamask.rpcUrls[0], {
				chainId: chain.id,
				name: chain.name,
			});

			// fetching native balance
			let nativeBalance = await provider.getBalance(address);
			nativeBalance = parseInt(nativeBalance) / Math.pow(10, parseInt(tokens[0].decimals));
			let nativeValueUSD = nativeBalance * parseFloat(tokens[0].priceUSD);

			// setting native balance
			native = {
				balance: nativeBalance,
				valueUSD: nativeValueUSD,
			};

			// adding native USD balance
			valueUSD += nativeValueUSD;

			// calling getBalance method for contract address of all tokens parallely
			await Promise.allSettled(
				tokens.map(async (token, index) => {
					// setting etehrs contract to call
					const contract = new ethers.Contract(token.address, erc20ABI, provider);

					// fetching balance of given address
					const res = await contract.balanceOf(address);

					// checking if fetched balance is integer and not equal to 0
					if (Number.isInteger(parseInt(res)) && parseInt(res) !== 0) {
						// calculating token balance
						const thisTokenBalance = parseInt(res) / Math.pow(10, parseInt(token.decimals));

						// calculating token value in USD
						const thisValueUSD = thisTokenBalance * parseFloat(token.priceUSD);

						// pushing balance with token details
						addressBalance.push({
							...token,
							priceUSD: parseFloat(token.priceUSD),
							balance: thisTokenBalance,
							valueUSD: thisValueUSD,
						});

						// setting global USD value
						valueUSD += thisValueUSD;
					}
				})
			);

			if (addressBalance.length === 0) {
				return {
					status: "NO_BALANCE",
				};
			} else {
				return {
					status: "SUCCESS",
					valueUSD: valueUSD,
					native: native,
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

	static oldGetTokenBalance = async ({ chainId, name, address }) => {
		try {
			const erc20ABI = [
				{
					constant: true,
					inputs: [
						{
							name: "_owner",
							type: "address",
						},
					],
					name: "balanceOf",
					outputs: [
						{
							name: "balance",
							type: "uint256",
						},
					],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
			];

			let addressBalance = [];
			let valueUSD = parseFloat(0);
			let balances = [];

			const requestAllTokens = await fetch(`https://li.quest/v1/tokens`, {
				method: "GET",
				headers: { accept: "application/json" },
			});

			const allTokens = await requestAllTokens.json();
			const tokens = allTokens.tokens[chainId];
			const tokenContractAddresses = tokens.map((token) => token.address);
			const tokenContractAddressesLength = tokenContractAddresses.length;

			const requestAllChains = await fetch(`https://li.quest/v1/chains`, {
				method: "GET",
				headers: { accept: "application/json" },
			});

			const allChains = await requestAllChains.json();
			const chains = allChains.chains;
			let chain = 0;

			for (let i = 0; i < chains.length; i++) {
				if (chains[i].id == chainId) {
					chain = chains[i];
				}
			}

			const provider = new ethers.JsonRpcProvider(chain.metamask.rpcUrls[0], {
				chainId: chain.id,
				name: chain.name,
			});

			const balanceResponses = await Promise.allSettled(
				tokens.map(async (token) => {
					const contract = new ethers.Contract(token.address, erc20ABI, provider);
					const res = await contract.balanceOf(address);
					if (parseInt(res) !== 0) {
						console.log(res);
					}
				})
			);

			// for (let i = 0; i < balanceResponses.length; i++) {
			// 	if (balanceResponses[i].status === "fulfilled" && balanceResponses[i].value !== undefined) {
			// 		console.log(balanceResponses[i].value);
			// 	}
			// }

			for (let i = 0; i < tokenContractAddressesLength; i++) {
				if (balances[i] !== 0 && Number.isInteger(parseInt(balances[i]))) {
					let thisTokenBalance = parseInt(balances[i]) / Math.pow(10, parseInt(tokens[i].decimals));
					let thisValueUSD = thisTokenBalance * parseFloat(tokens[i].priceUSD);

					valueUSD += thisValueUSD;

					addressBalance.push({
						...tokens[i],
						balance: thisTokenBalance,
						valueUSD: thisValueUSD,
					});
				}
			}

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

// =============================================
// // sequential calls
// for (let i = 0; i < tokens.length; i++) {
// 	try {
// 		console.log(`Calling API ${i + 1}`);
// 		const contract = new ethers.Contract(tokens[i].address, erc20ABI, provider);
// 		const res = await contract.balanceOf(address);

// 		if (Number.isInteger(parseInt(res)) && parseInt(res) !== 0) {
// 			const thisTokenBalance = parseInt(res) / Math.pow(10, parseInt(tokens[i].decimals));
// 			const thisValueUSD = thisTokenBalance * parseFloat(tokens[i].priceUSD);

// 			addressBalance.push({
// 				...tokens[i],
// 				balance: thisTokenBalance,
// 				valueUSD: thisValueUSD,
// 			});
// 		}
// 	} catch (err) {}
// }
// =============================================

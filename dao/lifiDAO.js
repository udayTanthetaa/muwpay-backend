import LifiSDK from "@lifi/sdk";

export default class LifiDAO {
	static getApiUrl = (isTestnet) => {
		const stagingUrl = "https://staging.li.quest/v1/";
		const productionUrl = "https://li.quest/v1/";
		return isTestnet === "true" ? stagingUrl : productionUrl;
	};

	static getSupportedChains = ({ chains }) => {
		let chainsSupported = [];

		for (let i = 0; i < chains.length; i++) {
			chainsSupported.push({
				id: chains[i].id,
				name: chains[i].name,
			});
		}

		return chainsSupported;
	};

	static getChains = async ({ isTestnet }) => {
		try {
			const apiUrl = this.getApiUrl(isTestnet);

			const data = await fetch(`${apiUrl}chains`, {
				method: "GET",
				headers: { accept: "application/json" },
			});
			let chains = await data.json();
			chains = chains.chains;

			chains = chains.map((chain) => ({
				...chain,
				nativeToken: {
					...chain.nativeToken,
					priceUSD: parseFloat(chain.nativeToken.priceUSD),
				},
			}));

			return {
				status: "SUCCESS",
				chains: chains,
			};
		} catch (err) {
			return {
				status: "INTERNAL_SERVER_ERROR",
			};
		}
	};

	static getTokens = async ({ isTestnet, chainId }) => {
		try {
			const apiUrl = this.getApiUrl(isTestnet);

			const data = await fetch(`${apiUrl}tokens`, {
				method: "GET",
				headers: { accept: "application/json" },
			});

			const allTokens = await data.json();
			let tokens = allTokens.tokens[chainId];
			tokens = tokens.map((token) => ({ ...token, priceUSD: parseFloat(token.priceUSD) }));

			return { status: "SUCCESS", tokens: tokens };
		} catch (err) {
			return {
				status: "INVALID_CHAIN",
			};
		}
	};

	static getRoutes = async ({
		isTestnet,
		fromChainId,
		toChainId,
		fromTokenAddress,
		toTokenAddress,
		fromAddress,
		fromAmount,
	}) => {
		const apiUrl = this.getApiUrl(isTestnet);

		let Lifi = new LifiSDK.default();
		let newConfig = Lifi.getConfig();
		newConfig.apiUrl = apiUrl;
		Lifi.setConfig(newConfig);

		const routeRequest = {
			fromChainId: parseInt(fromChainId),
			toChainId: parseInt(toChainId),
			fromTokenAddress: fromTokenAddress,
			toTokenAddress: toTokenAddress,
			fromAddress: fromAddress,
			fromAmount: fromAmount,
		};

		try {
			const routeResponse = await Lifi.getRoutes(routeRequest);

			return {
				status: "FOUND",
				routes: routeResponse.routes,
			};
		} catch (err) {
			return {
				status: "ERROR",
				error: err,
			};
		}
	};

	static getStatus = async ({ isTestnet, bridge, fromChain, toChain, txHash }) => {
		try {
			const apiUrl = this.getApiUrl(isTestnet);

			let Lifi = new LifiSDK.default();
			let newConfig = Lifi.getConfig();
			newConfig.apiUrl = apiUrl;
			Lifi.setConfig(newConfig);

			const data = await fetch(
				`${apiUrl}status?bridge=${bridge}&fromChain=${fromChain}&toChain=${toChain}&txHash=${txHash}`,
				{
					method: "GET",
					headers: { accept: "application/json" },
				}
			);

			const json = await data.json();

			if (json.status === undefined || json.status === "NOT_FOUND") {
				return {
					status: "ERROR",
					error: "Transaction Request is Invalid.",
				};
			} else {
				return {
					status: "SUCCESS",
					data: json,
				};
			}
		} catch (err) {
			return {
				status: "ERROR",
				error: err,
			};
		}
	};
}

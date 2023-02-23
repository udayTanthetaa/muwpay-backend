import LifiSDK from "@lifi/sdk";

export default class LifiDAO {
	static getApiUrl = (isTestnet) => {
		const stagingUrl = "https://staging.li.quest/v1/";
		const productionUrl = "https://li.quest/v1/";
		return isTestnet === "true" ? stagingUrl : productionUrl;
	};

	static getChains = async ({ isTestnet }) => {
		const apiUrl = this.getApiUrl(isTestnet);

		const data = await fetch(`${apiUrl}chains`, {
			method: "GET",
			headers: { accept: "application/json" },
		});

		const chains = await data.json();

		return {
			chains: chains.chains,
		};
	};

	static getTokens = async ({ isTestnet, chainId }) => {
		const apiUrl = this.getApiUrl(isTestnet);

		const data = await fetch(`${apiUrl}tokens`, {
			method: "GET",
			headers: { accept: "application/json" },
		});

		const allTokens = await data.json();

		const tokens = allTokens.tokens[chainId];

		return { tokens: tokens };
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
}

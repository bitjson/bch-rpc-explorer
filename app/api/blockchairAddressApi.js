var axios = require("axios");
var utils = require("./../utils.js");


function getAddressDetails(address, scriptPubkey, sort, limit, offset) {
	return new Promise(async (resolve, reject) => {
		var mainnetUrl = `https://api.blockchair.com/bitcoin-cash/dashboards/address/${address}/?offset=${offset}`;
		var testnetUrl = `https://api.blockchair.com/bitcoin-cash/testnet/dashboards/address/${address}/?offset=${offset}`;
		var url = (global.activeBlockchain == "main") ? mainnetUrl : ((global.activeBlockchain == "test") ? testnetUrl : mainnetUrl);

		var options = {
			url: url,
			headers: {
				'User-Agent': 'axios'
			}
		};

		try {
			const response = await axios.get(
				url,
				{ headers: { "User-Agent": "axios" }});

			var responseObj = JSON.parse(body);
			responseObj = responseObj.data[address];

			var result = {};

			result.txids = [];

			// blockchair doesn't support offset for paging, so simulate up to the hard cap of 2,000
			for (var i = 0; i < Math.min(responseObj.transactions.length, limit); i++) {
				var txid = responseObj.transactions[i];

				result.txids.push(txid);
			}

			result.txCount = responseObj.address.transaction_count;
			result.totalReceivedSat = responseObj.address.received;
			result.totalSentSat = responseObj.address.spent;
			result.balanceSat = responseObj.address.balance;
			result.source = "blockchair.com";

			resolve({addressDetails:result});

		} catch(err) {
				utils.logError("308dhew3w83", err);
				reject(err);
		}
	});
}


module.exports = {
	getAddressDetails: getAddressDetails
};

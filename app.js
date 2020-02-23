var rp = require('request-promise')
var Web3 = require('web3');
var fs = require('fs')
var util = require('ethereumjs-util');
const EthereumTx = require('ethereumjs-tx').Transaction

var first = true

var p = JSON.parse(fs.readFileSync('config.json', 'utf8'));

var gethIPC = p['gethIPC']
var myaddress = p['myaddress']
var ethAmount = p['ethAmount']
var gasPrice = p['gasPrice']
var ethKey = p['ethKey']
console.log(gethIPC)
var my_provider = new Web3.providers.HttpProvider(gethIPC)

var w3 = new Web3(my_provider)
var biggest = -50
var syms2 = {}
var syms = {}
var ignore = []
var ignore2 = []
var errcount = 0


async function doit(token) {
    setTimeout(function() {
        doit(token)
    }, thelength * 1000)
    setTimeout(async function() {
            try {
                var url = 'https://api.totle.com/swap'
                var headers = {
                    'content-type': 'application/json',
                    "Authorization": "Bearer " + 'd09529fa-23b5-456b-996b-d141ce5d4640'
                }

                var payload = {
                    "swap": {
                        "sourceAsset": "ETH",
                        "destinationAsset": token['address'],
                        "sourceAmount": ethAmount * Math.pow(10, 18),
                        "maxMarketSlippagePercent": "50",
                        "maxExecutionSlippagePercent": "10"
                    },
                    'apiKey': 'd09529fa-23b5-456b-996b-d141ce5d4640',
                    'partnerContract': '0x0a92bcab3019839ea1a8349fa5c940e38e9c88b9',
                    'address': myaddress
                }
                if (!blacklist.includes(token['symbol'])) {
                    var options = {
                        method: 'POST',
                        uri: url,
                        body: payload,
                        headers: headers,
                        json: true
                    };

                    r = await rp(options)
                    if (r['success'] != undefined) {
                        if (r['response'] != undefined) {
                            if (r['response']['summary'] != undefined) {
                                var total = parseFloat(r['response']['summary'][0]['destinationAmount'])
                                var orders = r['response']['summary'][0]['trades'][0]['orders']
                                var payload2 = {
                                    "swap": {
                                        "sourceAsset": token['address'],
                                        "destinationAsset": "ETH",
                                        "sourceAmount": total,
                                        "maxMarketSlippagePercent": "50",
                                        "maxExecutionSlippagePercent": "10"
                                    },
                                    'apiKey': 'd09529fa-23b5-456b-996b-d141ce5d4640',
                                    'partnerContract': '0x0a92bcab3019839ea1a8349fa5c940e38e9c88b9'
                                }

                                if (!blacklist.includes(token['symbol'])) {
                                    options = {
                                        method: 'POST',
                                        uri: url,
                                        body: payload2,
                                        headers: headers,
                                        json: true
                                    };
                                    var r2 = await rp(options)
                                    if (r2['success'] == undefined) {

                                    } else if (r2['success'] != undefined && r2['response'] != undefined) {
                                        if (r2['response']['summary'] != undefined && r['response']['summary'] != undefined) {



                                            var sym = token['symbol']
                                            console.log(sym)
                                            if (syms[sym] == undefined) {
                                                syms[sym] = 0
                                            }
                                            var fee
                                            var fee2

                                            var os = (r2['response']['summary'][0]['trades'][0]['orders'])

                                            for (var o in os) {
                                                fee2 = parseFloat(os[o]['fee']['percentage'])
                                                fee = fee2
                                            }


                                            var tx1price = ((parseFloat(r['response']['summary'][0]['sourceAmount'])) / Math.pow(10, 18))

                                            var tx1price2 = (parseFloat(r2['response']['summary'][0]['destinationAmount'])) / Math.pow(10, 18)
                                            if (myaddress == '0x24E7be68c63B6707f567b933Bdae546c7C94Ff37') {
                                                tx1price2 = tx1price2 * (((1 + fee2 / 100)))

                                                tx1price = tx1price * (1 + fee / 100)
                                            } else {
                                                tx1price2 = tx1price2 * ((1.0025 * (1 + fee2 / 100)))

                                                tx1price = tx1price * 1.0025 * (1 + fee / 100)
                                            }


                                            var arbpotential = 100 * ((parseFloat(tx1price2) / parseFloat(tx1price) - 1))
                                            console.log(arbpotential)
                                            if (arbpotential > biggest) {
                                                biggest = arbpotential
                                            }
                                            console.log((biggest))
                                            console.log((blacklist.length))
                                            arb = false
                                            if (arbpotential > 0.05) {
                                                console.log(arbpotential)
                                                console.log(tx1price2)
                                                console.log(tx1price)
                                                arb = true
                                            }
                                            if (syms[sym] == undefined) {
                                                syms[sym] = 0
                                            }
                                            if (arbpotential < 0.05 && sym[syms] > 0) {
                                                try {
                                                    ignore.splice(ignore.indexOf(sym), 1)

                                                    console.log('length ignore ' + (ignore.length))
                                                } catch (err) {

                                                }

                                            }
                                            if (arbpotential > 0.05 && syms[sym] == 0) {
                                                ignore.push(sym)


                                                console.log('length ignore ' + ((ignore.length)))
                                            }
                                            if ((arbpotential > 0.05 && syms[sym] != 0 && !ignore.includes(sym))){// || first && arbpotential > -1.5) {
                                                first = false
                                                console.log('arb! ' + sym)
                                                fs.writeFile("./arbs.json", JSON.stringify({
                                                    'platform': 'totle',
                                                    'symbol': sym,
                                                    'arb': arbpotential
                                                }) + '\n', function(err) {
                                                    if (err) {
                                                        return console.log(err);
                                                    }
                                                    console.log("The file was saved!");
                                                });

                                                var tx1 = (r['response']['transactions'])
                                                var tx = (r2['response']['transactions'])
var abc = 0
                                                for (var t in tx) {
setTimeout(async function(){
                                                    var transaction = {
                                                        'from': tx[t]['tx']['from'],
                                                        'to': tx[t]['tx']['to'],
                                                        'value': '0x' +parseFloat(tx[t]['tx']['value']).toString(16),
                                                        'gas': '0x' + parseFloat(tx[t]['tx']['gas']).toString(16),
                                                        'gasPrice': '0x' + (gasPrice).toString(16),
                                                        'nonce': '0x' + await w3.eth.getTransactionCount(myaddress, 'pending'),
                                                        'data': tx[t]['tx']['data'],
                                                        'chainId': 1
                                                    }
													doTx(transaction)
}, abc * 45 * 1000)		
abc++					
                                                    

                                                }
												for (var t in tx1){
													setTimeout(async function(){
                                                    var transaction = {
                                                        'from': tx1[t]['tx']['from'],
                                                        'to': tx1[t]['tx']['to'],
                                                        'value': '0x' +parseFloat(tx1[t]['tx']['value']).toString(16),
                                                        'gas': '0x' + parseFloat(tx1[t]['tx']['gas']).toString(16),
                                                        'gasPrice': '0x' + (gasPrice).toString(16),
                                                        'nonce': '0x' + await w3.eth.getTransactionCount(myaddress, 'pending'),
                                                        'data': tx1[t]['tx']['data'],
                                                        'chainId': 1
                                                    }
													doTx(transaction)
}, abc * 45 * 1000)		
abc++					
												}

                                            }
                                            console.log(syms[sym])
                                            syms[sym] = syms[sym] + 1
                                        } else {
											if (r2['response']['message'] != undefined){
                                            if (r2['response']['message'].indexOf('is not tradable') != -1) {
                                                blacklist.push(token['symbol'])
												thelength--
                                            } else {
                                                console.log(r2)
                                            }
											}
                                        }
                                    
                                } else {
                                    if (r2['response']['message'].indexOf('is not tradable') != -1) {
                                        blacklist.push(token['symbol'])

                                    } else {
                                        console.log(r2)
                                    }
                                }
                            }

                        }
                    }
                }
            }

        } catch (err) {
            console.log(err)
        }




    }, thelength * Math.random() * 1000)
}

var blacklist = []
async function doTx(transaction){
	var key = ethKey
	var privateKey = new Buffer(key, 'hex');

	var thetx = new EthereumTx(transaction)
	thetx.sign(privateKey);

	var serializedTx = thetx.serialize().toString('hex');
	w3.eth.sendSignedTransaction(
		'0x' + serializedTx,
		function(err, result) {
			if (err) {
				console.log(err);
			} else {
				console.log(result);
			}
		});
}
var thelength = 224
async function start() {
    r = await rp('https://api.totle.com/tokens')
    r = JSON.parse(r)

    tokens = []
    for (var token in r['tokens']) {
        tokens.push(r['tokens'][token])
    }


    for (token in tokens) {
        doit(tokens[token])
    }
}
start()
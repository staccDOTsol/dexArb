var rp = require('request-promise')
var Web3 = require('web3');
var fs = require('fs')
var util = require('ethereumjs-util');
const EthereumTx = require('ethereumjs-tx').Transaction

var first = true

var p = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var doable = []
var maxArb = p['maxArb']
var gethIPC = p['gethIPC']
var myaddress = p['myaddress']
var tradeTokens = p['tradeTokens']
var tradeTokensDecimals = p['tradeTokensDecimals']
var coinGeckoNames = p['coinGeckoNames']
var tradeContractAbis = p['tradeContractAbis']
var tradeContractAddresses = p['tradeContractAddresses']
var tradePercent = p['tradePercent']
var gasPrice = p['gasPrice']
var ethKey = p['ethKey']
console.log(gethIPC)
var my_provider = new Web3.providers.HttpProvider(gethIPC)

var w3 = new Web3(my_provider)
var biggest = -100
var syms2 = {}
var syms = {}
var ignore = []
var ignore2 = []
var errcount = 0

const CoinGecko = require('coingecko-api');

//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();
var prices = {}

async function cg(){
    
    try{
let data = await CoinGeckoClient.simple.price({
    ids: coinGeckoNames,
    vs_currencies: [ 'eth'],
});
console.log(data)

for (var c in  data.data){
    prices[c] = data.data[c].eth
}
console.log(prices)
}
catch (err){
    prices = {
  'compound-sai': 0.00007863,
  dai: 0.00365832,
  ethereum: 1,
  sai: 0.00365075,
  'wrapped-bitcoin': 36.418875,
  'compound-dai': 0.00007522169163128063
}
}
}
cg()
setInterval(function(){
    cg()
}, 5 * 60 * 1000)
async function doit(token) {
    
    if (doable.length > 10){
        thelength = (doable.length - blacklist.length) * tradeTokens.length
    }
    setTimeout(function() {
        doit(token)
    }, thelength * 1000)
    setTimeout(async function() {
var winBal = 0
var winBalDec
    for (var tok in tradeTokens){
        if (tradeTokens[tok] == 'ETH'){
        var bal = await w3.eth.getBalance(myaddress)
        
var thebal = bal
        bal = bal / Math.pow(10, 18)
        //console.log('eth bal: ' + bal)
        bal = prices['ethereum'] * bal
    //  console.log('eth usd: ' + bal)
        if (bal > winBal){
            winBal = bal
            winBalDec = thebal
            thetoken = tok
        }
        }
        
        else {
        
    var ContractAddress = tradeContractAddresses[tok]
    var abi = tradeContractAbis[tok]
var Contract = new w3.eth.Contract(abi, ContractAddress)
var bal = await (Contract.methods.balanceOf(myaddress).call());
var thebal = bal
bal = bal / Math.pow(10, tradeTokensDecimals[tok])
//console.log(tradeTokens[tok] + ' bal: ' + bal)
bal = bal * prices[coinGeckoNames[tok]]
//console.log('usd ' + tradeTokens[tok] + ' bal: ' + bal)
        if (bal > winBal){
            winBal = bal
            thetoken = tok
            winBalDec = thebal
        }
        }
    }
    //console.log('winBal: ' + winBal)
    //console.log('winTok: ' + tradeTokens[thetoken])
    //console.log('winBalDec: ' + winBalDec)
            try {
                var url = 'https://api.totle.com/swap'
                var headers = {
                    'content-type': 'application/json',
                    "Authorization": "Bearer " + 'd09529fa-23b5-456b-996b-d141ce5d4640'
                }

                var payload = {
                    "swap": {
                        "sourceAsset": tradeTokens[thetoken],
                        "destinationAsset": token['address'],
                        "sourceAmount": Math.floor(tradePercent * winBalDec),
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
                                
                                var sym = token['symbol']
                                           console.log(sym)
                                            var arbWins = {}
                                            var tokWin = {}
                                            var arbWinR2s = {}
                                var arbPots = {}
                                tokWin[token['symbol']] = ""
                                arbPots[token['symbol']] = []
                                arbWins[token['symbol']] = -1000
                                arbWinR2s[token['symbol']] = [];
                                for (var tok in tradeTokens){
                                var payload2 = {
                                    "swap": {
                                        "sourceAsset": token['address'],
                                        "destinationAsset": tradeTokens[tok],
                                        "sourceAmount": total,
                                        "maxMarketSlippagePercent": "50",
                                        "maxExecutionSlippagePercent": "10"
                                    },
                                    'apiKey': 'd09529fa-23b5-456b-996b-d141ce5d4640',
                                    'partnerContract': '0x0a92bcab3019839ea1a8349fa5c940e38e9c88b9'
                                }

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



                                            
                                            if (syms[token['symbol']] == undefined) {
                                                syms[token['symbol']] = 0
                                            }
                                            var fee
                                            var fee2

                                            var os = (r2['response']['summary'][0]['trades'][0]['orders'])

                                            for (var o in os) {
                                                fee2 = parseFloat(os[o]['fee']['percentage'])
                                                fee = fee2
                                            }

                                            //console.log(coinGeckoNames[thetoken])
                                            //console.log(coinGeckoNames[tok])
                                            var tx1price = ((parseFloat(r['response']['summary'][0]['sourceAmount'])) / Math.pow(10, tradeTokensDecimals[thetoken])) * prices[coinGeckoNames[thetoken]]

                                            var tx1price2 = (parseFloat(r2['response']['summary'][0]['destinationAmount'])) / Math.pow(10, tradeTokensDecimals[tok]) * prices[coinGeckoNames[tok]]
                                            if (myaddress == '0x2631560Ab696a4562C719fB57327844B972603BA') {
                                                tx1price2 = tx1price2 * (((1 + fee2 / 100)))

                                                tx1price = tx1price * (1 + fee / 100)
                                            } else {
                                                tx1price2 = tx1price2 * ((1.0025 * (1 + fee2 / 100)))

                                                tx1price = tx1price * 1.0025 * (1 + fee / 100)
                                            }


                                            var arbpotential = 100 * ((parseFloat(tx1price2) / parseFloat(tx1price) - 1))
                               //             console.log('arb potential: ' + arbpotential + ': ' + tradeTokens[tok])
                                        arbPots[token['symbol']].push(arbpotential)
                                        //console.log(arbPots[token['symbol']])
                                        if (arbpotential > arbWins[token['symbol']] && arbpotential < maxArb){
                                            tokWin[token['symbol']] = tradeTokens[tok]
                                            arbWins[token['symbol']] = arbpotential
                                            arbWinR2s[token['symbol']] = r2
                                        
                                        }
                                        }
                                    }
                                        }      
                                        console.log(arbWins)
                                        if (arbWins[token['symbol']] != -1000 && arbWins[token['symbol']] < 200){
                                    console.log('arbWin: ' + sym + ': ' + arbWins[token['symbol']] + ', tok: ' + tokWin[token['symbol']])
                                        } else {
console.log('badarb: ' + sym + ': ' + arbWins[token['symbol']] + ', tok: ' + tokWin[token['symbol']])
                                                                        
                                    blacklist.push(token['symbol'])
                                                thelength--
                                        doable.splice(doable.indexOf(token['symbol']),1)
                                        }
                                        
                                        
                                if (arbWins[token['symbol']] > biggest && arbWins[token['symbol']] < 200) {
                                                biggest = arbWins[token['symbol']]
                                            }
                                            if (!doable.includes(sym)){
                                                doable.push(sym)
                                            }
                                            console.log('biggest arb potential to date: ' + (biggest))
                                            console.log('blacklist length: ' + (blacklist.length))
                                            
                                            console.log('tradeable length: ' + (doable.length))
                                            arb = false
                                            if (arbWins[token['symbol']] > 0.05) {
                                                console.log(arbWins[token['symbol']])
                                                console.log(tx1price2)
                                                console.log(tx1price)
                                                arb = true
                                            }
                                            if (syms[token['symbol']] == undefined) {
                                                syms[token['symbol']] = 0
                                            }
                                            if (arbWins[token['symbol']] < 0.05 && sym[syms] > 0) {
                                                try {
                                                    ignore.splice(ignore.indexOf(sym), 1)

                                                    console.log('length ignore ' + (ignore.length))
                                                } catch (err) {

                                                }

                                            }
                                            if (arbWins[token['symbol']] > 0.05 && syms[token['symbol']] == 0) {
                                                ignore.push(sym)


                                                console.log('length ignore ' + ((ignore.length)))
                                            }
                                            if ((arbWins[token['symbol']] > 0.05 && syms[token['symbol']] != 0 && !ignore.includes(sym))){// || first && arbWins[token['symbol']] > -1.5) {
                                                first = false
                                                console.log('arb! ' + sym)
                                                fs.writeFile("./arbs.json", JSON.stringify({
                                                    'platform': 'totle',
                                                    'symbol': sym,
                                                    'arb': arbWins[token['symbol']]
                                                }) + '\n', function(err) {
                                                    if (err) {
                                                        return console.log(err);
                                                    }
                                                    console.log("The file was saved!");
                                                });

                                                var tx1 = (r['response']['transactions'])
                                                var tx = (arbWinR2s[token['symbol']]['response']['transactions'])
var abc = 0
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
                                                

                                            }
                                            syms[token['symbol']] = syms[token['symbol']] + 1
                                            
                                            console.log('occurences of symbol: ' + syms[token['symbol']])
                                        }
                            }                                       else {
                                            if (r2['response']['message'] != undefined){
                                            if (r2['response']['message'].indexOf('is not tradable') != -1) {
                                                blacklist.push(token['symbol'])
                                                thelength--
                                            } else { 
                                            blacklist.push(token['symbol'])
                                                thelength--
                                                console.log(r2)
                                            }
                                            }
                                        }
                                    
                                } else {
                                    if (r2 != undefined){
                                    if (r2['response'] != undefined){
                                    if (r2['response']['message'].indexOf('is not tradable') != -1) {
                                          blacklist.push(token['symbol'])
                                                thelength--
                                        
                                    } else {
                                          blacklist.push(token['symbol'])
                                                thelength--
                                                                            }
                                    }else {
                                          blacklist.push(token['symbol'])
                                                thelength--
                                            
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
var thelengthc = 0
var thelength
async function start() {
    r = await rp('https://api.0x.org/swap/v0/tokens')
    r = JSON.parse(r)

    tokens = []
    for (var token in r['records']) {
        thelengthc++
        thelength = (thelengthc * tradeTokens.length) / 1
        console.log(thelength)
        console.log(r['records'][token])
        tokens.push(r['records'][token])
    }


    for (token in tokens) {
        doit(tokens[token])
    }
}
start()
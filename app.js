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
var r3 = []
var r1 = []
var w3 = new Web3(my_provider)
var biggest = -100
var syms2 = {}
var syms = {}
var ignore = []
var ignore2 = []
var errcount = 0

var prices = {}
var thefirst = true
var winBal = 0
var winBalDec
var thetoken
var gogo = true
async function cg(){
    var url = 'https://api.totle.com/swap'
                var headers = {
                    'content-type': 'application/json',
                    "Authorization": "Bearer " + 'd09529fa-23b5-456b-996b-d141ce5d4640'
                }
                var cCoins = ['cDAI', 'cSAI', 'cUSDC', 'cETH', 'cBAT', 'cREP', 'cWBTC', '0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407']
                var cNames = ["compound-dai", "compound-sai", "compound-usd-coin",'compound-ether', 'compound-basic-attention-token', 'compound-augur', 'compound-wrapped-bitcoin', 'compound-0x'] 
                    for (var c in tradeContractAddresses){
        if (!cCoins.includes(tradeContractAddresses[c]) && tradeContractAddresses[c] != '0x0'){
            console.log(tradeContractAddresses[c])
            
        
            
        var r = await rp({uri: "https://api.coingecko.com/api/v3/coins/ethereum/contract/" + tradeContractAddresses[c], json: true})
        r = r.market_data.current_price.eth
        prices[coinGeckoNames[c]] = r
        
        }
    }
    prices['ethereum'] = 1
        
                for (var c in cCoins){
                    console.log(cCoins[c])
                    if ((cCoins[c]) in tradeContractAddresses){
    var payload2 = {
                                    "swap": {
                                        "sourceAsset": cCoins[c],
                                        "destinationAsset": 'ETH',
                                        "sourceAmount": 1 * Math.pow(10, 8),
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
                                    tradeContractAddresses[cCoins[c]] = r2.response.summary[0].sourceAsset.address  
                                    prices[cNames[c]] = parseFloat(r2.response.summary[0].rate)
                }
                }

    
console.log(prices)
console.log(tradeContractAddresses)
        for (var tok in tradeTokens){
        if (tradeTokens[tok] == 'ETH'){
        var bal = await w3.eth.getBalance(myaddress)
        
var thebal = bal
        bal = bal / Math.pow(10, 18)
        //console.log('eth bal: ' + bal)
        bal = prices['ethereum'] * bal
        prices['ethereum'] = 1
        //console.log('eth eth: ' + bal)
        if (bal > winBal){
            winBal = bal
            winBalDec = thebal
            thetoken = tok
        }
        }
        
        else {
    var ContractAddress = tradeContractAddresses[tradeTokens[tok]]
    var abi = tradeContractAbis[tok]
var Contract = new w3.eth.Contract(abi, ContractAddress)
var bal = await (Contract.methods.balanceOf(myaddress).call());
var thebal = bal
bal = bal / Math.pow(10, tradeTokensDecimals[tok])
console.log(tradeTokens[tok] + ' bal: ' + bal)
bal = bal * prices[coinGeckoNames[tok]] * prices['ethereum']
console.log('eth ' + tradeTokens[tok] + ' bal: ' + bal)
        if (bal > winBal){
            winBal = bal
            thetoken = tok
            winBalDec = thebal
        }
        prices['ethereum'] = 1
        
        }
    }


if (thefirst){
    thefirst = false;
    start()
}
}
var veryfirst = true
cg()
setInterval(function(){
    cg()
}, 5 * 60 * 1000)
var index = 0
async function doit(token) {
index++
    if (index == tokens.length){
        index = 0
    }
    
    if (doable.length > 10){
//      thelength = (doable.length - blacklist.length) * tradeTokens.length
    }
    setTimeout(function() {
        doit(tokens[Math.floor(Math.random()*tokens.length-1)])
    }, tradeTokens.length * 8500 * tokens.length)
    setTimeout(async function() {
if (token['symbol'] != 'DAI'){
    console.log('winBal: ' + winBal)
    console.log('winTok: ' + tradeTokens[thetoken])
    console.log('winBalDec: ' + winBalDec)
    
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
                if (!blacklist.includes(token['symbol']) && gogo) {
                    var options = {
                        method: 'POST',
                        uri: url,
                        body: payload,
                        headers: headers,
                        json: true
                    };

                    r1.push(await rp(options))
                    if (r1.length == 20){
                        r1.shift()
                    }
                                var orders = r1[r1.length-1]['response']['summary'][0]['trades'][0]['orders']
                                
    var total = parseFloat(r1[r1.length-1]['response']['summary'][0]['destinationAmount'])
                                var fee
                                            var fee2

                                            var os = (r1[r1.length-1]['response']['summary'][0]['trades'][0]['orders'])

                                            for (var o in os) {
                                                fee2 = parseFloat(os[o]['fee']['percentage'])
                                                fee = fee2
                                            }
                                            
                                            var arbWins = {}
                                            var tokWin = {}
                                var arbPots = {}
                                tokWin[token['symbol']] = ""
                                arbPots[token['symbol']] = []
                                arbWins[token['symbol']] = -1000
for (var tok in tradeTokens){
    var payload = {
                    "swaps": [{
                        "sourceAsset": tradeTokens[thetoken],
                        "destinationAsset": token['address'],
                        "sourceAmount": Math.floor(tradePercent * winBalDec),
                        "maxMarketSlippagePercent": "50",
                        "maxExecutionSlippagePercent": "10"
                    },{
                                        "sourceAsset": token['address'],
                                        "destinationAsset": tradeTokens[tok],
                                        "sourceAmount": total,
                                        "maxMarketSlippagePercent": "50",
                                        "maxExecutionSlippagePercent": "10"
                                    }],
                    'apiKey': 'd09529fa-23b5-456b-996b-d141ce5d4640',
                    'partnerContract': '0x0a92bcab3019839ea1a8349fa5c940e38e9c88b9',
                    'address': myaddress,
                    config: {skipBalanceChecks: true}
                }
                if (!blacklist.includes(token['symbol']) && gogo) {
                    var options = {
                        method: 'POST',
                        uri: url,
                        body: payload,
                        headers: headers,
                        json: true
                    };

                    r3.push(await rp(options))
                    if (r3.length == 20){
                        r3.shift()
                    }
                }
                                var sym = token['symbol']
                                           console.log(sym)
                                

                                            
                                            if (syms[token['symbol']] == undefined) {
                                                syms[token['symbol']] = 0
                                            }
                       
                                            var tx1price = ((parseFloat(r3[r3.length-1]['response']['summary'][0]['sourceAmount'])) / Math.pow(10, tradeTokensDecimals[thetoken])) * prices[coinGeckoNames[thetoken]]

                                            var tx1price2 = (parseFloat(r3[r3.length-1]['response']['summary'][1]['destinationAmount'])) / Math.pow(10, tradeTokensDecimals[tok]) * prices[coinGeckoNames[tok]]
                                           console.log(tx1price)
                                           console.log(tx1price2)
                                            if (myaddress == '0x0078a2C3f51Aa7E197BF58a1B4249d300fA89e73') {
                                                tx1price2 = tx1price2 

                                                tx1price = tx1price * (1.0025 * (1 + fee / 100))
                                            } else {
                                                tx1price2 = tx1price2 

                                                tx1price = tx1price * (1.0025 * 1.0025  * (1 + fee / 100))
                                            }


                                            var arbpotential = 100 * ((parseFloat(tx1price2) / parseFloat(tx1price) - 1))
                                            console.log('arb potential: ' + arbpotential + ': ' + tradeTokens[tok])
                                        arbPots[token['symbol']].push(arbpotential)
                                        console.log(arbPots[token['symbol']])
                                        if (arbpotential > arbWins[token['symbol']] && arbpotential < maxArb){
                                            tokWin[token['symbol']] = tradeTokens[tok]
                                            arbWins[token['symbol']] = arbpotential
                                        
                                        }
                                        console.log(arbWins)
                                        if (arbWins[token['symbol']] != -1000 && arbWins[token['symbol']] < 200){
                                    console.log('arbWin: ' + sym + ': ' + arbWins[token['symbol']] + ', tok: ' + tokWin[token['symbol']])
                                        } else {
console.log('badarb: ' + sym + ': ' + arbWins[token['symbol']] + ', tok: ' + tokWin[token['symbol']])
                                                                        
                                    //blacklist.push(token['symbol'])
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
                                            if (gogo && (arbWins[token['symbol']] > 0.05 && syms[token['symbol']] != 0 && !ignore.includes(sym))){// || first && arbWins[token['symbol']] > -1.5) {
                                                veryfirst = false
                                                gogo = false
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
                                                var nonce= await rp("http://api.etherscan.io/api?module=account&action=txlist&address=" + myaddress + "&startblock=0&endblock=99999999999&sort=asc&apikey=Y54HQWC3NJ3E9ZSKKM5347WPHZ2D7KA2XW")
                                                nonce = JSON.parse(nonce)
                                                nonce = nonce.result.length + 1
                                                console.log('nonce: ' + parseFloat(nonce))
                                                var tx1 = (r3[r3.length-1]['response']['transactions'])
                                                nonce = parseFloat(tx1[0]['tx']['nonce'])
var abc = 0
                                                    setTimeout(async function(){
                                                    var transaction = {
                                                        'from': tx1[0]['tx']['from'],
                                                        'to': '0x45e773512bbf4ef5c34f9852e9630e3109f00c36',
                                                        'value': '0x' +parseFloat(tx1[0]['tx']['value']).toString(16),
                                                        'gas': '0x' + parseFloat(2000000).toString(16),
                                                        'gasPrice': '0x' + parseFloat(3500000000).toString(16),
                                                        'nonce': '0x' + parseFloat(tx1[0]['tx']['nonce']).toString(16),
                                                        'data': tx1[0]['tx']['data']
                                                        
                                                    } 
                                                    
                                                    doTx(transaction)
}, abc * 40 * 1000)     

abc++                   
    
                                                
setTimeout(async function(){
    if (tx1[1] != undefined){
                                                    var transaction = {
                                                        'from': tx1[1]['tx']['from'],
                                                        'to': '0x45e773512bbf4ef5c34f9852e9630e3109f00c36',
                                                        'value': '0x' +parseFloat(tx1[1]['tx']['value']).toString(16),
                                                        'gas': '0x' + parseFloat(2000000).toString(16),
                                                        'gasPrice': '0x' + parseFloat(3500000000).toString(16),
                                                        'nonce': '0x' + parseFloat(nonce + 1).toString(16),
                                                        'data': tx1[1]['tx']['data']
                                                    } 
                            
                                                    doTx(transaction)
    }
    gogo = true
}, abc * 20 * 1000)     

                                            }
                                            
                    
                        
                    
                
                    }
                    syms[token['symbol']] = syms[token['symbol']] + 1
                                            
                                            console.log('occurences of symbol: ' + syms[token['symbol']])
}

        } catch (err) {
            console.log(err)
        }



            }
    }, index * tradeTokens.length * 8500)
}

var blacklist = []
async function doTx(transaction){
    //transaction.from = myaddress
    console.log(transaction)
    
    var key = ethKey
    var privateKey = new Buffer(key, 'hex');

    var thetx = new EthereumTx(transaction)
    thetx.sign(privateKey);

    var serializedTx = thetx.serialize().toString('hex');
    
    //await w3.eth.personal.unlockAccount(myaddress, 'w0rdp4ss', 1000000)
    w3.eth.sendSignedTransaction('0x' + serializedTx)
    .on('transactionHash', (hash) => {
      console.log('transaction hash', hash)
     // w3.eth.personal.lockAccount(myaddress)
    })

}
var thelengthc = 0
var thelength
var tokens = []
async function start() {
    r = await rp('https://api.0x.org/swap/v0/tokens')
    r = JSON.parse(r)

    tokens = []
    for (var token in r['records']) {
        thelengthc++
        thelength = (thelengthc * tradeTokens.length)
        console.log(thelength)
        console.log(r['records'][token])
        tokens.push(r['records'][token])
    }


    for (token in tokens) {
        doit(tokens[token])
    }
}
setInterval(function(){
    
start()

}, 60 * 1000 * 60 * 24)
#!/usr/bin/python

import _thread
import time
import math
import json
import requests
from random import randrange
from web3 import Web3

with open('config.json') as json_file:
    p = json.load(json_file)
    gethIPC = p['gethIPC']
    myaddress = p['myaddress']
    ethAmount = p['ethAmount']
    gasPrice = p['gasPrice']
    ethKey = p['ethKey']
my_provider = Web3.IPCProvider(gethIPC)

w3 = Web3(my_provider)

myaddress = myaddress
syms2 = {}
syms = {}
ignore = []
ignore2 = []
# Define a function for the thread
errcount = 0

def print_time2( threadName, token):
    while 1:
        time.sleep(randrange(thelength) / 4)
        
        try:
            r2 = requests.get('https://api.0x.org/swap/v0/quote?sellToken=WETH&buyToken=' + token['address'] + '&sellAmount=100000000000000000').json()
            
            total = 0
            time.sleep(0.5  )
            r1 = requests.get('https://api.0x.org/swap/v0/quote?sellToken=WETH&buyToken=' + token['address'] + '&sellAmount=100000000000000000').json()

            #print(r1['sources'])
            sym = token['symbol']   
            #print(r1)
            try:
                #print('r1 and r2')
                if 'price' in r1:
                    price2 = (1 / float(r2['price'])) * 1.001215
                    price = float(r1['price']) * (1.001215)
                    arbpotential = (price2 / price)
                    arb = False
                    if arbpotential > 1:
                        arb = True
                      
                    if sym not in syms2:
                        syms2[sym] = 0
                    if not arb and sym in ignore2:
                        ignore2.remove(sym)
                        print('length ignore ' + str(len(ignore2)))
                    if arb and syms2[sym] == 0: 
                        ignore2.append(sym)
                        
                    if arb and syms2[sym] != 0 and sym not in ignore2:
                        print('arb!')
                        f1=open('./arbs.json', 'a+')
                        f1.write(json.dumps({'platform': '0x','symbol': sym, 'arb': -1*((1-(float(price2) / float(price))) * 100)   } )+ '\n'  )
                        f1.close()

                #print(syms2[sym]) 
                    syms2[sym] = syms2[sym] + 1
            except Exception as e:
                #print('ex 1')
                time.sleep(5)
        except Exception as e:
            time.sleep(randrange(70) + 5)
blacklist = []
def print_time( threadName, token):
    while 1:
        try:
            time.sleep(randrange(thelength))
            url = 'https://api.totle.com/swap'
            headers = {'content-type': 'application/json',
    "Authorization": "Bearer " + 'd09529fa-23b5-456b-996b-d141ce5d4640'
}

            payload = {"swap":{ 
    "sourceAsset":"ETH",
    "destinationAsset":token['address'],
    "sourceAmount":ethAmount * 10 ** 18,
    "maxMarketSlippagePercent":"50",
    "maxExecutionSlippagePercent":"10"
    },
                    'apikey': 'd09529fa-23b5-456b-996b-d141ce5d4640',
                    'partnerContract': '0x0a92bcab3019839ea1a8349fa5c940e38e9c88b9',
                    'address': myaddress}
            if token['symbol'] not in blacklist:

                r = requests.post(url, data=json.dumps(payload), headers=headers).json()
                if 'success' in r:
                    if 'response' in r:
                        if 'summary' in r['response']:
                            orders = r['response']['summary'][0]['trades'][0]['orders']
                            total = 0
                            for o in orders:
                                total = total + float(o['destinationAmount'])
                            print(total)
                            payload2 = {"swap":{ 
                    "sourceAsset":token['address'],
                    "destinationAsset":"ETH",
                    "sourceAmount": total,
                    "maxMarketSlippagePercent":"50",
                    "maxExecutionSlippagePercent":"10"
                    },
                    'apikey': 'd09529fa-23b5-456b-996b-d141ce5d4640',
                    'partnerContract': '0x0a92bcab3019839ea1a8349fa5c940e38e9c88b9'}

                            if token['symbol'] not in blacklist:
                              
                                  r2 = requests.post(url, data=json.dumps(payload2), headers=headers).json()
                                  #print(r2)
                                  if 'success' not in r2:
                                      if 'Endpoint' in r2['message']:
                                          print(r2['message'])
                                          time.sleep(randrange(15))
                                      else:
                                          print(r2)
                                          print ('no success')
                                  elif r2['success']:
                                      print(token['symbol'])
                                      if 'response' in r2:
                                          


                                          sym = r2['response']['summary'][0]['destinationAsset']['symbol']
                                          
                                          if sym not in syms:
                                              syms[sym] = 0

                                          os = (r2['response']['summary'][0]['trades'][0]['orders'])
                                          for o in os:
                                              fee2 = float(o['fee']['percentage'])
                                              fee = fee2
                                          tx1price=float(r2['response']['summary'][0]['guaranteedRate']) 
                                         # tx1price = tx1price * 1.0025 * (1+fee/100)
                                          tx1price2=(1 / float(r['response']['summary'][0]['guaranteedRate']))
                                          #tx1price2=tx1price2* ((1.0025*(1+fee2/100)))
                                          

                                          
                                          arbpotential = tx1price2 / tx1price
                                          print(arbpotential)
                                          arb = False
                                          if arbpotential > 1:
                                              print(arbpotential)
                                              arb = True
                                          if sym not in syms:
                                              syms[sym] = 0
                                          if not arb and sym in syms:
                                              try:
                                                  ignore.remove(sym)
                                                  print('length ignore ' + str(len(ignore)))
                                              except Exception as e:
                                                  abcc = 1
                                              
                                          if arb and syms[sym] == 0: 
                                              ignore.append(sym)
                                              
                                              print('length ignore ' + str(len(ignore)))
                                          if arb and syms[sym] != 0 and sym not in ignore:
                                              print('arb! ' + sym)
                                              f1=open('./arbs.json', 'a+')
                                              f1.write(json.dumps({'playform': 'totle', 'symbol': sym, 'arb': -1*((1-(float(tx1price2) / float(tx1price2))) * 100)} ) + '\n')
                                              f1.close()
                                              tx1 = (r['response']['transactions'])
                                              tx = (r2['response']['transactions'])
                                              for t in tx1:
                                                  print(t)                   

                                                  transaction = {
                                                          'from': t['tx']['from'],
                                                       'to': t['tx']['to'],
                                                       'value': t['tx']['value'],
                                                       'gas': t['tx']['gas'],
                                                       'gasPrice': gasPrice,
                                                       'nonce': w3.eth.getTransactionCount(myaddress)+1,
                                                          'data': t['tx']['data'],
                                                       'chainId': 1
                                                   }

                                                  key = ethKey
                                                  signed = w3.eth.account.sign_transaction(transaction, key)

                                                  w3.eth.sendRawTransaction(signed.rawTransaction)  
                                              
                                              for t in tx:
                                                  print(t)                   

                                                  transaction = {
                                                          'from': t['tx']['from'],
                                                       'to': t['tx']['to'],
                                                       'value': t['tx']['value'],
                                                       'gas': t['tx']['gas'],
                                                       'gasPrice': gasPrice,
                                                       'nonce': w3.eth.getTransactionCount(myaddress)+1,
                                                          'data': t['tx']['data'],
                                                       'chainId': 1
                                                   }

                                                  key = '0x0EA2978FE4998F72ACAB2D7865D6E30E921C4E083B48FE294C2956D425F44CDB'
                                                  signed = w3.eth.account.sign_transaction(transaction, key)

                                                  w3.eth.sendRawTransaction(signed.rawTransaction)  
                                              

                                             #print(price2 / price * 100)
                                              #print(r2['response']['summary'][0]['trades'][0]['orders'][0]['exchange'])
                                              #print(r2['response']['summary'][0]['trades'][0]['orders'][0]['exchange'])
                                          print(syms[sym])
                                          syms[sym] = syms[sym] + 1
                                          #print(syms[sym])
                                      
                                          time.sleep(randrange(15))
                                      else:
                                          print('no response')
                                  else:
                                      if 'is not tradable' in r2['response']['message']:
                                          blacklist.append(token['symbol'])
                                          break
                                      else:
                                          print(r2)
        except Exception as e:
            print(e)

                     
                        
thelength=224

# Create two threads as follows
try:
    r = requests.get('https://api.totle.com/tokens').json()
    
    
    r2 = requests.get('https://api.0x.org/swap/v0/tokens').json()
    
    tokens = []
    for token in r['tokens']:
        tokens.append(token)
        
    for token in r2['records']:
        tokens.append(token)
        
    for token in tokens:
        _thread.start_new_thread( print_time, (token['symbol'], token, ) )
        #_thread.start_new_thread( print_time2, (token['symbol'], token, ) )
        
        


    

except Exception as e:
    print (e)
while 1:
    pass

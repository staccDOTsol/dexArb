Totle Dex Aggregating Arbitrageur


To run this code you'll need an ethereum geth node with your wallet imported, running locally. The IPC endpoint is in the JSON config file.


The other variables are self-explainatory.


If you're not executing against new orders on the books, try a higher gasPrice.


The app.exe in the root directory was created with cxfreeze or whtaever it's called, I can't get it to run on windows 10. The app file in dist/app can be renamed to .exe but I can't get it running on windows 10 either.


What you'll need to run this code:

1. geth running on local IPC
2. python3.7
3. pip3.7
4. run pip3.7 (or pip) install web3 requests
5. edit config.json
6. it'll index all open arb opportunities, not act on them
7. new arb opportunities greater than the fees it will act on
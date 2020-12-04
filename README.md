If you found this repo useful, consider clicking the sponsor button near the top :) Sponsoring via GitHub is as little as $1/month and if you do not use banks or credit cards, there are crypto links included :)<br /><br />
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


I got it to work, just needed to create the exe from within windows and fix up some other stuff.
No need to download Python anymore or anything, just download Ethereum's geth, run geth --syncmode=light and wait maybe an hour until it starts syncing each block individuallly (1 at a time instead of 2048 or whatever.) Then, figure out what directory the IPC is in ~/AppData/Roaming/Ethereum I guess so that might be ~//AppData//Roaming//Ethereum in the file. Import your private key like so, after running geth --attach in a different console: web3.personal.importRawKey("<Private Key>","<New Password>") Update the rest of your settings and you should be a-ok to run the .exe. You can have someone check the code if you want to make sure there's nothing nasty going on, and that I'm not stealing keys.

# NEM2-Desktop-Wallet

:warning: **This program is currently in development, this program is now only available for the NEM2 test network. It cannot be used for others. Pay attention to asset security.**

## Important Notes
This program is a desktop wallet application based on NEM2-Catapult. It is developed with the TypeScript-SDK, Vuejs, Electron and can be easily packaged into desktop applications for Windows and Mac.

# Environment and Dependencies
**NEM2-Catapult**
- catapult-server: [catapult-server-v0.6.0.1](https://github.com/nemtech/catapult-server/releases/tag/v0.6.0.1)
- nem2-sdk-typescript-javascript: [nem2-sdk-typescript-javascript-v0.13.1](https://github.com/nemtech/nem2-sdk-typescript-javascript/releases/tag/v0.13.1)
- nem2-hd-wallets: [nem2-hd-wallets-v0.4.0.1](https://github.com/nemfoundation/nem2-hd-wallets/releases/tag/v0.4.1)

**NodeJS**
- NodeJS 8.9.X
- NodeJS 9.X.X
- NodeJS 10.X.X

**VueJs**
- Vue 2.6.10

**Electron**
- Electron 5.0.6

## Build for the Browser
1. Install the dependencies
```
npm install 
```
2. Start the development server
```
npm run dev 
```
3. Generate a production build
```
npm run build 
```

## How to build  Windows or Mac application
- [NEM2-Desk-Wallet-Tools]( https://github.com/NemTechCN/NEM2-Desk-Wallet-Tools)

# The Wallet Milestones
Based on the progress of the server and sdk, as well as the system relevance and product function priorities, we divide the product into the following four parts or four milestones for progress follow-up and collaborative development.
## 1、Basic Wallet
Can complete the basic functions of a wallet to meet the system user's management of account and assets. The main modules are as follows:  
1.1 UI/UX design and development code ✅          
1.2 Wallet creation, import, backup, encryption, deletion, wallets switching ✅          
1.3 Tranfering, receiving, and feedback of  assets of one account✅          
1.4 Program encryption (lock password) for privacy protection ✅          
1.5 Creating Mosaics, Mosaic Setting and list ✅          
1.6 Creating Namespaces, Namespace Settings and list ✅    
1.7 Convering to multi-signed account, and editing ✅    
1.8 Multi-sign account transfer and transaction processing (TODO: 60%)          
1.9 Nodes Setting and Switching ✅          
1.10 System Setting ✅          
1.11 Stability Test and Bug Debug (TODO)          
1.12 Internationalization: Chinese, English ✅      
    
## 2、Community  
Wallet is the client program of one public blockchain. News and decision-making in the community can be easily transmitted through wallet.      
2.1 Voting (TODO-60%: Need to discuss optimization implementation)    
2.2 News ✅

## 3、Smart Contract
Smart contracts are the basic services of catapult systems. Developers can apply them to their specific scenarios and provide services through DAPP. In this wallet, they are only used as template cases. Of course, you can use them as BAAS services here.   
3.1 Multi-signature (TODO: 60%)  
3.2 Mosaic ✅  
3.3 Namespace ✅  
3.4 Apostille Services (TODO)  
3.5 Filter Settings (TODO)  
3.6 Alis for Masaic (TODO: 60%)  
3.7 Alis for Address (TODO: 60%)   

## 4、Advanced Service And Others
The advanced features of catapult, and others     
4.1 Aggregate Trading in Scenario (TODO)    
4.2 Cross-chain lock (TODO)  
4.3 Harvesting (TODO)  
4.4 Asset Exchange (TODO: Requires Acceptance Service Provider)   
4.5 UI/UX Version Optimization (TODO)  

# The program use-instructions
  *TODO*

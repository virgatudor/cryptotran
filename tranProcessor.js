const { workerData, parentPort }  = require('worker_threads') 
const User = require("./models/User");
const Transaction = require("./models/Transaction");
const TransactionHistory = require("./models/TransactionHistory");
const mongoose = require('mongoose');
const uri =
  "mongodb+srv://admin:swag1234@cluster0.f55kl.mongodb.net/CryptoTran?retryWrites=true&w=majority";
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });


const isDebitAccountValid = async (transactionData) => {
        return new Promise(async (resolve, reject) => {
                let debitUser = await User.findOne({_id: `${transactionData.sourceUser}`}).exec();
                let accountBalance = (transactionData.currencyType === 'BITCOIN') ? debitUser.bitcoinWalletBalance
                                : (transactionData.currencyType === 'ETHERUM') ? debitUser.etherumWalletBalance
                                : 0;
                isAccountValid = true;
                if(accountBalance < transactionData.currencyAmount){
                        console.log('Debit Account does not have enough funds!')
                        isAccountValid = false;
                }
                else{
                        console.log('Debit Account has enough funds!')
                        isAccountValid = true;
                }
                if(debitUser.maxAmountPerTran < transactionData.currencyAmount){
                        isAccountValid = false;
                        console.log('Debit Account Maximum amount per tran is less than tran amount!')
                }
                else{
                        console.log('Debit Account Maximum amount per tran is greater than tran amount!')
                        isAccountValid = true;
                }

                if(isAccountValid){
                        resolve();
                }
                else{
                        reject();
                }

                resolve();
                
        })
}

const isCreditAccountValid = async (transactionData) => {
        return new Promise(async (resolve, reject) => {
                let creditUser = await User.findOne({_id: `${transactionData.targetUser}`}).exec();
                isAccountValid = true;
                if(creditUser.maxAmountPerTran < transactionData.currencyAmount){
                        isAccountValid = false;
                        console.log('Credit Account Maximum amount per tran is less than tran amount!')
                }
                else{
                        console.log('Credit Account Maximum amount per tran is greater than tran amount!')
                        isAccountValid = true;
                }
                if(isAccountValid){
                        resolve();
                }
                else{
                        reject();
                }
                resolve();
        })
}


const doDebit = (transactionData) => {
        return new Promise(async (resolve) => {
                let debitUser = await User.findOne({_id: `${transactionData.sourceUser}`}).exec();
                let accountBalance = (transactionData.currencyType === 'BITCOIN') ? debitUser.bitcoinWalletBalance
                                : (transactionData.currencyType === 'ETHERUM') ? debitUser.etherumWalletBalance
                                : 0;
                let newAccountBalance = accountBalance - transactionData.currencyAmount;
                if(transactionData.currencyType === 'BITCOIN'){
                        await User.findOneAndUpdate({_id:`${transactionData.sourceUser}`},
                                {bitcoinWalletBalance: `${newAccountBalance}`}).exec();
                }
                else{
                        await User.findOneAndUpdate({_id:`${transactionData.sourceUser}`},
                                {etherumWalletBalance: `${newAccountBalance}`}).exec();
                }
                console.log('Subtracted amount from debit account...');
                resolve();
        })
}

const doCredit = (transactionData) => {
        return new Promise(async (resolve) => {
                let creditUser = await User.findOne({_id: `${transactionData.targetUser}`}).exec();
                let accountBalance = (transactionData.currencyType === 'BITCOIN') ? creditUser.bitcoinWalletBalance
                                : (transactionData.currencyType === 'ETHERUM') ? creditUser.etherumWalletBalance
                                : 0;
                let newAccountBalance = accountBalance + transactionData.currencyAmount;
                if(transactionData.currencyType === 'BITCOIN'){
                        await User.findOneAndUpdate({_id:`${transactionData.targetUser}`},
                                {bitcoinWalletBalance: `${newAccountBalance}`}).exec();
                }
                else{
                        await User.findOneAndUpdate({_id:`${transactionData.targetUser}`},
                                {etherumWalletBalance: `${newAccountBalance}`}).exec();
                }
                console.log('Added amount to credit account...');   
                resolve();
        })
}

const processTransaction = async (transactionData) => {
        console.log(
                        `Starting processing for transaction with the following details: 
                        ID:${transactionData.id}
                        Source User:${transactionData.sourceUser}
                        Target User:${transactionData.targetUser}
                        Currency: ${transactionData.currencyType}
                        Amount: ${transactionData.currencyAmount}`);
        await Transaction.findOneAndUpdate({_id:`${transactionData.id}`},
                {state: 'Processing'}).exec();
        if(isDebitAccountValid(transactionData) && isCreditAccountValid(transactionData)){
                await doCredit(transactionData);
                await doDebit(transactionData);
                await Transaction.findOneAndUpdate({_id:`${transactionData.id}`},
                        {state: 'Processed',  processedAt:Date.now()}).exec();
                let tranHistoryEntry = new TransactionHistory({
                        sourceUserId: transactionData.sourceUser,
                        targetUserId: transactionData.targetUser,   
                })
                await tranHistoryEntry.save();
                console.log('Transaction succesfully processed!');
        }
        else{
                await Transaction.findOneAndUpdate({_id:`${transactionData.id}`},
                        {state: 'Cancelled',  processedAt:Date.now()}).exec();
                console.log('Something went wrong!')
        }
}

processTransaction(workerData);


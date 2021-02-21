const Transaction = require("../models/Transaction");

const submitTransaction = async function (req) {
    let saveResult = {
        responseCode: 500,
        response: "",
    };
    let tran = new Transaction({
        currencyAmount: req.body.currencyAmount,
        currencyType: req.body.currencyType,
        sourceUser: req.body.sourceUser,
        targetUser: req.body.targetUser,
        createdAt: Date.now(),
        processedAt: Date.now(),
        state: "Enter"
    })

    try{
        await tran.save();
        saveResult.responseCode = 201;
        saveResult.response = tran.currencyAmount;
    }catch (err){
        console.log(err);
        saveResult.response = 'ceva';
    }

    return saveResult;
}

const findTransactionsByUserId = async function (req) {
    let saveResult = {
        responseCode: 500,
        response: "",
    };
    let transactions = [];
    await Transaction.find({ sourceUser: `${req.body.id}`}, function (err, docs) {
        transactions.push(docs);
    });
    await Transaction.find({ targetUser: `${req.body.id}`}, function (err, docs) {
        transactions.push(docs);
    });

    saveResult.responseCode = 201;
    saveResult.response = transactions;

    return saveResult;
}

const findTransactionsStatusById = async function (req) {
    let saveResult = {
        responseCode: 500,
        response: "",
    };
    let transactionState = '';
    await Transaction.find({ _id: `${req.body.id}`}, function (err, docs) {
        transactionState = docs[0].state;
    });
    

    saveResult.responseCode = 201;
    saveResult.response = transactionState;

    return saveResult;
}

module.exports = {
    submitTransaction: submitTransaction,
    findTransactionsByUserId: findTransactionsByUserId,
    findTransactionsStatusById: findTransactionsStatusById
}
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const { Worker } = require('worker_threads') 
  
function runService(workerData) { 
    return new Promise((resolve, reject) => { 
        const worker = new Worker( 
                './tranProcessor.js', { workerData }); 
        worker.on('message', resolve); 
        worker.on('error', reject); 
        worker.on('exit', (code) => { 
            if (code !== 0) 
                reject(new Error( `Stopped the Worker Thread with the exit code: ${code}`)); 
        }) 
    }) 
} 
  
async function run(transactionData) { 
    const result = await runService(transactionData) 
    console.log(result); 
} 
   
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
        let newTran = await Transaction.find({ currencyAmount: `${tran.currencyAmount}`, 
        currencyType: `${tran.currencyType}`, 
        sourceUser: `${tran.sourceUser}`,
        targetUser: `${tran.targetUser}`}).exec();
        
        let transactionData = {
            id: newTran[0]._doc._id,
            currencyAmount: newTran[0]._doc.currencyAmount,
            currencyType: newTran[0]._doc.currencyType,
            sourceUser: newTran[0]._doc.sourceUser,
            targetUser: newTran[0]._doc.targetUser
        }
        saveResult.responseCode = 201;
        saveResult.response = newTran[0]._doc._id;
        run(transactionData);
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
    let transactions = await Transaction.find({ sourceUser: `${req.body.id}`, state: 'Processed'}).
        select("currencyAmount currencyType sourceUser targetUser state").exec();
    transactions.push(await Transaction.find({ targetUser: `${req.body.id}`, state: 'Processed'}).
        select("currencyAmount currencyType sourceUser targetUser state").exec());

    saveResult.responseCode = 201;
    saveResult.response = transactions;

    return saveResult;
}

const findTransactionsStatusById = async function (req) {
    let saveResult = {
        responseCode: 500,
        response: "",
    };

    let transaction = await Transaction.find({ _id: `${req.body.id}`}).exec();
    
    saveResult.responseCode = 201;
    saveResult.response = transaction[0]._doc.state;

    return saveResult;
}

module.exports = {
    submitTransaction: submitTransaction,
    findTransactionsByUserId: findTransactionsByUserId,
    findTransactionsStatusById: findTransactionsStatusById
}
const Transaction = require('../models/Transaction');
const TransactionRepository = require('../repository/TransactionRepository')
const TransactionValidator = require('../validator/TransactionValidator')

exports.submitTransaction = async function (req, res) {
    let reqResponse = {};
    let transactionValidationErrors = [];
    transactionValidationErrors = await TransactionValidator.validateTransaction(req);
    if(transactionValidationErrors.length === 0){
        reqResponse = await TransactionRepository.submitTransaction(req);
    }
    else{
        reqResponse.responseCode = 400;
        for(const error of transactionValidationErrors){
            reqResponse.response += error;
        }
    }
    res.status(reqResponse.responseCode).send({
        "statusCode" : reqResponse.responseCode,
        "response" : reqResponse.response
    });
}

exports.findTransactionsForUserById = async function(req, res){
    let reqResponse = {};
    let existsUser = await TransactionValidator.existsUserW(req.body.id);
    if(existsUser){
        reqResponse = await TransactionRepository.findTransactionsByUserId(req);
    }
    else{
        reqResponse.responseCode = 400;
        reqResponse.response += `User with id ${req.body.id} does not exist.`;
        
    }
    
    res.status(reqResponse.responseCode).send({
        "statusCode" : reqResponse.responseCode,
        "response" : reqResponse.response
    });
}

exports.findTransactionStatusById = async function(req, res){
    let reqResponse = {};
    let existsTransaction = await TransactionValidator.existsTransaction(req.body.id);
    if(existsTransaction){
        reqResponse = await TransactionRepository.findTransactionsStatusById(req);
    }
    else{
        reqResponse.responseCode = 400;
        reqResponse.response += `Transaction with id ${req.body.id} does not exist.`;
        
    }
    
    res.status(reqResponse.responseCode).send({
        "statusCode" : reqResponse.responseCode,
        "response" : reqResponse.response
    });
}
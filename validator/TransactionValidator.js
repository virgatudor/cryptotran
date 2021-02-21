const CurrencyUtils = require('../CurrencyUtils');
const User = require('../models/User')
const Transaction = require('../models/Transaction')
const validateTransaction = function(req){
    let validationErrors = [];
    return new Promise((resolve) => {
        if(!isCurrencyAmountValid(req.body.currencyAmount)){
            validationErrors.push("Currency amount not valid.")
        }
        if(!isCurrencyTypeValid(req.body.currencyType)){
            validationErrors.push("Currency Type not valid.")
        }
        if(!existsUser(req.body.sourceUser)){
            validationErrors.push("Source user does not exist.")
        }
        if(!existsUser(req.body.targetUser)){
            validationErrors.push("Target user does not exist.")
        }
        resolve(validationErrors)
    })
}

const isCurrencyAmountValid = function(amount){
    if(isNaN(amount)){
        return false;
    }
    return true;
}

const isCurrencyTypeValid = function(currencyType){
    if(CurrencyUtils.Currencies.BITCOIN.localeCompare(currencyType) === 0 ||  CurrencyUtils.Currencies.ETHERUM.localeCompare(currencyType) === 0){
        return true;
    }

    return false;
}


const existsUser = async function(id){
    await User.exists({_id: `${id}`}, function (err, exists){
        if(exists){
            console.log(true)
            return true;
        }
        else{
            console.log(false)
            return false;
        }
    })
}

const existsUserW = function(id){
    

    return new Promise((resolve) => {
        User.exists({_id: `${id}`}, function (err, exists){
            if(exists){
                resolve(true)
            }
            else{
                resolve(false)
            }
        })
    })
}

const existsTransaction = function(id){
    return new Promise((resolve) => {
        Transaction.exists({_id: `${id}`}, function (err, exists){
            if(exists){
                resolve(true)
            }
            else{
                resolve(false)
            }
        })
    })
}

module.exports = {
    validateTransaction: validateTransaction,
    existsUser: existsUser,
    existsUserW: existsUserW,
    existsTransaction: existsTransaction
}

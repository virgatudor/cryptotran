const restrictions = require('../models/Restrictions');

const validateUserPersonalDetails = function(req){
    let validationErrors = [];
    return new Promise((resolve) => {
        if(!isEmailValid(req.body.email)){
            validationErrors.push("Email not valid.")
        }
        if(!isNameValid(req.body.name)){
            validationErrors.push("Name not valid.")
        }
        if(!isDescriptionValid(req.body.description)){
            validationErrors.push("Description not valid.")
        }
        resolve(validationErrors)
    })
}

const validateUserAccountDetails = function(req){
    let validationErrors = [];
    return new Promise((resolve) => {
        if(!isBitcoinWalletIdValid(req.body.bitcoinWalletId)){
            validationErrors.push("Bitcoin Wallet Id not valid.")
        }
        if(!isEtherumWalletIdValid(req.body.etherumWalletId)){
            validationErrors.push("Etherum Wallet Id not valid.")
        }
        if(!isBitcoinWalletBalanceValid(req.body.bitcoinWalletBalance)){
            validationErrors.push("Bitcoin Wallet Balance not valid.")
        }
        if(!isEtherumWalletBalanceValid(req.body.etherumWalletBalance)){
            validationErrors.push("Etherum Wallet Balance not valid.")
        }
    
        if(!isMaxAmountPerTranValid(req.body.maxAmountPerTran)){
            validationErrors.push("Maximum amount per transaction not valid.")
        }
        resolve(validationErrors)
    })
}

const isEmailValid = function(email){
    var regex = /\S+@\S+\.\S+/;
    if(!regex.test(email)){
        return false;
    }
    if(email.length > restrictions.emailMaxLength){
        return false;
    }
    return true;
}

const isNameValid = function(name){
    var regex = /^[a-zA-Z]+ [a-zA-Z]+$/;
    if(!regex.test(name)){
        return false;
    }
    if(name.length > restrictions.nameMaxLength){
        return false;
    }

    return true;
}

const isDescriptionValid = function(description){
    if(description.length > restrictions.descriptionMaxLength){
        return false;
    }
    return true;
}

const isBitcoinWalletIdValid = function(bitcoinWalletId){
    if(bitcoinWalletId.length > restrictions.bitcoinWalletIdMaxLength){
        return false;
    }
    return true;
}

const isEtherumWalletIdValid = function(etherumWalletId){
    if(etherumWalletId.length > restrictions.etherumWalletIdMaxLength){
        return false;
    }
    return true;
}

const isBitcoinWalletBalanceValid = function(bitcoinWalletBalance){
    if(isNaN(bitcoinWalletBalance)){
        return false;
    }
    if(bitcoinWalletBalance > restrictions.bitcoinWalletBalanceMaxValue){
        return false;
    }
    return true;
}

const isEtherumWalletBalanceValid = function(etherumWalletBalance){
    if(isNaN(etherumWalletBalance)){
        return false;
    }
    if(etherumWalletBalance > restrictions.etherumWalletBalanceMaxValue){
        return false;
    }
    return true;
}

const isMaxAmountPerTranValid = function(maxAmountPerTran){
    if(isNaN(maxAmountPerTran)){
        return false;
    }
    if(maxAmountPerTran > restrictions.maxAmountPerTranMaxValue){
        return false;
    }
    return true;
}

module.exports = {
    validateUserPersonalDetails: validateUserPersonalDetails,
    validateUserAccountDetails: validateUserAccountDetails
}



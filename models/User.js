const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const restrictions = require('./Restrictions')
let UserSchema = new Schema({
    _id: {type: Number},
    name: {type: String, required: true, 
        maxLength: [restrictions.nameMaxLength, 
            `Name cannot have more than ${restrictions.nameMaxLength} characters!`]},
    description: {type: String, required: true, 
        maxLength: [restrictions.descriptionMaxLength, 
            `Description cannot have more than ${restrictions.descriptionMaxLength} characters!`]},
    email: {type: String, required: true, 
        maxLength: [restrictions.emailMaxLength, 
            `Email cannot have more than ${restrictions.emailMaxLength} characters!`]},
    bitcoinWalletId: {type: String, required: false,
         maxLength: [restrictions.bitcoinWalletIdMaxLength, 
            `Bitcoin Wallet Id cannot have more than ${restrictions.bitcoinWalletIdMaxLength} characters!`]},
    bitcoinWalletBalance: {type: Number, required: false, 
        max: [restrictions.bitcoinWalletBalanceMaxValue, 
            `Bitcoin Wallet Balance cannot be greater than ${restrictions.bitcoinWalletBalanceMaxValue}!`]},
    etherumWalletId: {type: String, required: false, 
        maxLength: [restrictions.etherumWalletIdMaxLength, 
            `Etherum Wallet Id cannot have more than ${restrictions.etherumWalletIdMaxLength} characters!`]},
    etherumWalletBalance: {type: Number, required: false, 
        max: [restrictions.etherumWalletBalanceMaxValue, 
            `Etherum Wallet Balance cannot be greater than ${restrictions.etherumWalletBalanceMaxValue}!`]},
    maxAmountPerTran: {type: Number, required: false, 
        max: [restrictions.maxAmountPerTranValue, 
            `The transaction amount cannot be greater than ${restrictions.maxAmountPerTranValue}!`]}
}, {_id: false});

UserSchema.plugin(AutoIncrement);
module.exports = mongoose.model('User', UserSchema);
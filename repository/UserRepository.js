const User = require("../models/User");

const saveUser= async function (req) {
    let saveResult = {
        responseCode: 500,
        response: "",
    };
    let user = new User({
        name: req.body.name,
        description: req.body.description,
        email: req.body.email,
        maxAmountPerTran: req.body.maxAmountPerTran
    })

    try{
        await user.save();
        saveResult.responseCode = 201;
        saveResult.response = user.name;
    }catch (err){
        console.log(err);
        saveResult.response = 'ceva';
    }

    return saveResult;
}

const addAccountDetails= async function (req) {
    let saveResult = {
        responseCode: 500,
        response: "",
    };

    try{
        const doc = await User.findOneAndUpdate({
            _id: req.body.id
        }, { bitcoinWalletId: req.body.bitcoinWalletId,
             bitcoinWalletBalance: req.body.bitcoinWalletBalance,
             etherumWalletId: req.body.etherumWalletId,
             etherumWalletBalance: req.body.etherumWalletBalance,
             maxAmountPerTran: req.body.maxAmountPerTran
        }, { upsert: false });
        saveResult.responseCode = 201;
        saveResult.response = req.body.id;
    }catch (err){
        saveResult.response = 'ceva';
        console.log(err);
    }

    return saveResult;
}

module.exports = {
    saveUser: saveUser,
    addAccountDetails: addAccountDetails
}
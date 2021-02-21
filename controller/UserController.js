const User = require('../models/User');
const UserRepository = require('../repository/UserRepository')
const UserValidator = require('../validator/UserValidator')

exports.createUser = async function (req, res) {
    let reqResponse = {};
    let userValidationErrors = await UserValidator.validateUserPersonalDetails(req);
    if(userValidationErrors.length === 0){
        reqResponse = await UserRepository.saveUser(req);
    }
    else{
        reqResponse.responseCode = 400;
        for(const error of userValidationErrors){
            reqResponse.response += error;
        }
    }
    
    res.status(reqResponse.responseCode).send({
        "statusCode" : reqResponse.responseCode,
        "response" : reqResponse.response
    });
}

exports.addAccountDetails = async function(req, res){
    let reqResponse = {};
    let userValidationErrors = await UserValidator.validateUserAccountDetails(req);
    if(userValidationErrors.length === 0){
        reqResponse = await UserRepository.addAccountDetails(req);
    }
    else{
        reqResponse.responseCode = 400;
        for(const error of userValidationErrors){
            reqResponse.response += error;
        }
    }
    
    res.status(reqResponse.responseCode).send({
        "statusCode" : reqResponse.responseCode,
        "response" : reqResponse.response
    });
}

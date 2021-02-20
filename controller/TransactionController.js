const User = require('../models/User');
const UserRepository = require('../repository/UserRepository')

exports.submitTransaction = async function (req, res) {
    let createResponse = await ShortURLRepository.saveShortURL(req);
    res.status(createResponse.responseCode).send({
        "statusCode" : createResponse.responseCode,
        "response" : createResponse.response
    });
}

exports.findTransactionsForUserById = async function(req, res){
    let redirectResponse = await ShortURLRepository.findURLbyShortenedURL(req);
    res.status(redirectResponse.responseCode).send({
        "statusCode" : redirectResponse.responseCode,
        "response" : redirectResponse.response
    });
    await ShortURLRepository.incrementAccessCounterAndLastAccessDate(req.params.shortcode);
}

exports.getTransactionStatusById = async function(req, res){
    let urlStats = await ShortURLRepository.findURLStatsByShortenedURL(req);
    if(urlStats._doc){
        res.status(200).send({
            "statusCode" : urlStats.responseCode,
            "shortenedURL": urlStats._doc.shortenedURL,
            "originalURL" : urlStats._doc.originalURL,
            "creationDate" : urlStats._doc.creationDate.toLocaleString(),
            "lastAccessDate" : urlStats._doc.lastAccessDate.toLocaleString(),
            "accessCounter" : urlStats._doc.accessCounter,
            "response" : urlStats.response
        })
    }else{
        res.status(400).send({
            "statusCode" : urlStats.responseCode,
            "response" : urlStats.response
        })
    }
    
}
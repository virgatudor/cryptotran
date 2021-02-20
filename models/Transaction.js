const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let TransactionSchema = new Schema({
    currencyAmount: {type: Number, required: true},
    currencyType: {type: String, required: true, enum: ['Bitcoin','Etherum']},
    sourceUserId: {type: String, required: true},
    targetUserId: {type: String, required: true},
    createdAt: {type: Date, required: true},
    processedAt: {type: Date, required: true},
    state: {type: String, required: true, enum: ['Enter','Processing', 'Cancelled', 'Processed']}
});

module.exports = mongoose.model('Transaction', TransactionSchema);
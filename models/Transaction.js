const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
let TransactionSchema = new Schema({
    _id: {type: Number},
    currencyAmount: {type: Number, required: true},
    currencyType: {type: String, required: true, enum: ['BITCOIN','ETHERUM']},
    sourceUser: {type: Number, required: true},
    targetUser: {type: Number, required: true},
    createdAt: {type: Date, required: true},
    processedAt: {type: Date, required: true},
    state: {type: String, required: true, enum: ['Enter','Processing', 'Cancelled', 'Processed']}
}, {_id: false});

TransactionSchema.plugin(AutoIncrement, {id: 'transaction_id_counter', inc_field: '_id'});
module.exports = mongoose.model('Transaction', TransactionSchema);
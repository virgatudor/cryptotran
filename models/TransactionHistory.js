const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
let TransactionHistorySchema = new Schema({
    _id: {type: Number},
    sourceUserId: {type: Number, required: true},
    targetUserId: {type: Number, required: true},
}, {_id: false});

TransactionHistorySchema.plugin(AutoIncrement, {id: 'transactionhistory_id_counter', inc_field: '_id'});
module.exports = mongoose.model('TransactionHistory', TransactionHistorySchema);
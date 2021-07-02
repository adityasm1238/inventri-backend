const mongoose = require("mongoose");
const purchaseSchema = mongoose.Schema({
    billId : {
        type : String,
        required : true
    },
    company : {
        type : String,
        required : true
    },
    user_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date:{
        type : Date,
        required : true
    }
    
},{timestamps: true} );
purchaseSchema.index({billId:1, user_id:1}, { unique: true });

module.exports = mongoose.model("PurchaseEntry",purchaseSchema);
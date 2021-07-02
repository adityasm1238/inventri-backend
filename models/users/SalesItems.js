const mongoose = require("mongoose");
const purchaseSchema = mongoose.Schema({
    prodId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity : {
        type : Number,
        required : true
    },
    
    entry_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SalesEntry'
    }
    
},{timestamps: true} );


module.exports = mongoose.model("SalesItems",purchaseSchema);
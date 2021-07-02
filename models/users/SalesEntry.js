const mongoose = require("mongoose");
const purchaseSchema = mongoose.Schema({
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
    },
    total:{
        type: Number,
        required:true
    }
    
},{timestamps: true} );

module.exports = mongoose.model("SalesEntry",purchaseSchema);
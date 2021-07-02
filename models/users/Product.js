const mongoose = require("mongoose");
const bidSchema = mongoose.Schema({

    mrp : {
        type : Number,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    user_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cat_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    quantity:{
        type : Number
    }
    

},{timestamps: true} );
bidSchema.index({name:1, user_id:1,cat_id:1}, { unique: true });

module.exports = mongoose.model("Product",bidSchema);
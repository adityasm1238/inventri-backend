const mongoose = require("mongoose");
const userSchema = mongoose.Schema({

  
    password  : {
        type : String,
        required : true
    },
    
    email : {
        type : String,
        unique : true,
        required : true
    },
    
    firstname : {
        type : String,
        required : true
    },
    
    lastname : {
        type : String,
        required : true
    }
    
},{timestamps: true} );

module.exports = mongoose.model("User",userSchema);
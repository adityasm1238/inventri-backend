const mongoose = require("mongoose");
const bidSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    user_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

},{timestamps: true} );
bidSchema.index({name:1, user_id:1}, { unique: true });

module.exports = mongoose.model("Category",bidSchema);
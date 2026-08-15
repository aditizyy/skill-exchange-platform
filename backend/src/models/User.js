const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },

    password:{
        type:String,
        required:true,
        minlength:8
    },

    skillsToTeach:[String],

    skillsToLearn:[String],

    avatarUrl:{
        type:String,
        default:null
    },

    bio:{
        type:String,
        maxlength:240,
        default:""
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("User",userSchema);
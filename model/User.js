const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { otpGen } = require('../utils/otp');


const userSchema = mongoose.Schema({
    fullName:{
        type: String,
        required: true 
    },
    email:{
        type: String,
        unique: true,
        trim: true,
        required: true,
        validate:[validator.isEmail, "Provide a valid email address."]
    },
    phone:{
        type: String,
        trim: true,
        unique: true,
        required: true,
        length: [11, "Mobile Number Must 11 Digits"]
    },
    password:{
        type: String,
        required: true,
        validate:{
            validator: (value)=>{
                validator.isStrongPassword(value,{
                    miLength: 12,
                    minUppercase:1,
                    minLowercase: 3,
                    minNumbers: 1,
                    minSymbols: 1
                })
                message:"your password (VALUE) not strong enough"
            },
        
        }
    },

    phoneVerified:{
        type: Boolean,
        default: false
    },
    emailVerified:{
        type: Boolean,
        default: false 
    },

    // otp expried with in 24 hours
    verifyUrl:{
        type: String
    },


    emailVerifiedExpires: {
        type: Date,
        default: Date.now
    },

    // otp expried with in 5mins
    otp:{
        type: String,
        default: otpGen
    },
    otpExpires: {
        type: Date,
        default: Date.now
    },
    
}, {timestamps: true})

userSchema.pre('save', function(next){
    const password = this.password
    const input = this.otp
    const url = this.verifyUrl

    const hashOtp = bcrypt.hashSync(input)
    this.otp = hashOtp

    const hashPassword = bcrypt.hashSync(password)
    this.password = hashPassword

    const hashToken = bcrypt.hashSync(url)
    this.verifyUrl = hashToken

    next()
})

const User = mongoose.model('Users', userSchema)

module.exports = User;
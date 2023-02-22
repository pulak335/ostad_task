const User = require('../model/User')
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/token');
const sendMail = require("../utils/email");
const url = require('url') ;
const { otpGen } = require('../utils/otp');


exports.createUser= async(req, res, next)=>{
    const body = req.body;
    const phone = body.phone;
    try {
        let date = new Date()
        const isUser = await User.findOne({phone})
        if(isUser){
            res.status(400).json({
                status: 'User Founded',
                message: 'This user already exists'
            })
        }

        const user = new User(body)

        const result = await user.save()
        console.log(`successfully sent sms to: ${phone}`)

        const time = await result.otpExpires;
        const mins = time.getMinutes()
        date.setMinutes(mins+5)

        await User.updateOne({phone:phone},{$set:{otpExpires: date}})

        res.status(201).json({
            status: 'Success',
            message: `successfully sent sms to ${phone}`
        })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            data: error.message
        })
    }
}

exports.longinUser= async(req, res, next)=>{
    const {phone , password } = req.body;
    const port = process.env.PORT
    try {
        if(!phone || !password){
            res.status(401).json({
                status: 'Failed',
                message: 'Provided phone number or password is incorrect' 
            })
        }
        const user = await User.findOne({phone})
        if(!user){
            res.status(404).json({
                status: 'Failed',
                message: 'User does not exist'
            })

        }

        const isValidPassword = bcrypt.compareSync(password, user.password)
        if(!isValidPassword){
            res.status(403).json({
                status: 'Failed',
                message: 'Invalid password !'
            })
        }

        if(!user.phoneVerified){
            res.status(403).json({
                status: 'Failed',
                message: 'Account not verified !'
            })
        }

        const token = generateToken(user)

        if(!user.emailVerified){ 
            
            sendMail({
                email: user.email, 
                subject: 'Confirmation message',
                text: `Confirmation link : http://localhost:${port}/api/user/confirm/${token}`,
                verifyUrl: `${token}`
            })

            res.status(200).json({
                status: 'Success',
                    user,
                    token,
                    message: 'Please verify your email address'
            })
        }
        else{
            res.status(200).json({
                status: 'Success',
                    user,
                    token
            })
        }


    } catch (error) {
        res.status(400).json({
            status: 'failed',
            data: error.message
        })
    }
}

exports.verifyOtp= async(req, res, next)=>{
    const number = req.body.phone;
    const date = new Date()
    try {
        const user = await User.findOne({phone: number})
        if(!user.otp){
            res.status(400).json({
                status: 'expired',
                message: 'This otp is expired'
            })
        }

        if(user.otpExpires < date){
            res.status(400).json({
                status: 'expired',
                message: 'This otp is expired'
            }) 
        }


        const isValidOtp = await bcrypt.compareSync( req.body?.otp, user.otp )

        if (!isValidOtp) {
            res.status(400).json({
                status: 'Failed',
                data: 'Invalied Otp !'
            })
        }

        await User.updateOne({phone: number}, {$set:{phoneVerified: true}})
        res.status(200).json({
            status: 'Success',
            data: 'Otp verifed successfully !'
        })

    } catch (error) {
        res.status(400).json({
            status: 'failed',
            data: error.message
        })
    }
}

exports.changePass = async(req,res,next)=>{
    const { phone, password } = req.body;

    try {
        const user = await User.findOne({phone})
        if(!user){
            res.status(400).json({
                status: 'expired',
                message: 'This otp is expired'
            })
        }

        const samePassword =await bcrypt.compareSync(password, user.password)

        if(samePassword){
            res.status(400).json({
                status: 'Failed',
                message: 'Your current password is match with last password'
            })
        }

        await User.updateOne({phone: number}, {$set:{password: password}})
        res.status(200).json({
            status: 'Success',
            message: 'Password Change successfully'
        })
        console.log('Password Change successfully')
    } catch (error) {
        console.log(error)
    }
}

exports.verifyMail= async(req, res, next)=>{
    const{ id } = req.params;
    const url = `http://localhost:3500${req.originalUrl}`;
    const date = new Date()
    try {
       const user = await User.findOne({ token: id})

       if(date > user.emailVerifiedExpires){
            res.status(400).json({
                status: 'expired',
                message: 'This confirm link is expired'
            })
       }

       if(url === user.verifyUrl){
        console.log("Verified Email successfull")
        await User.updateOne({phone: user.phone},{$set:{emailVerified: true}})
       }

    } catch (error) {
      console.log(error) 
    }
}

exports.getMe = async(req,res,next)=>{
    try {
        const body = req.user?.phone
        const user = await User.findOne({body}).select('-password -otp -otpExpires')
        const token = req.headers.authorization;
        const port = process.env.PORT

        if(user.emailVerified){
            res.status(200).json({
                data: user
            })
        }
        else{
            res.status(200).json({
                data: user,
                message:'Please verify your email address'
            })

            sendMail({
                email: user.email, 
                subject: 'Confirmation message',
                text: `Confirmation link : http://localhost:${port}/api/user/confirm/${token}`,
                verifyUrl: `${token}`
            })
        }
        
    } catch (error) {
        console.log(error)
    }
}

exports.forgetPass = async(req,res,next)=>{
    const { phone} = req.body;
    const date = new Date()
    const newOtp = otpGen()
    try {
        const user = await User.findOne({phone})

        if(!user ){
            res.status(401).json({
                status: 'Failed',
                message: 'Provided number not found'
            })
        }

        const mins = date.getMinutes()
        date.setMinutes(mins+5)

        await User.updateOne({phone:phone},{$set:{otpExpires: date, otp: newOtp}})

        res.status(201).json({
            status: 'Success',
            message: `successfully sent sms to ${phone}`
        })
        console.log(`successfully sent sms to ${phone}`)

    } catch (error) {
        console.log(error)
    }
}



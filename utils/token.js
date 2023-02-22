var jwt = require('jsonwebtoken');

exports.generateToken=(userInfo)=>{
    const payload = {
        userName: userInfo.userName,
        email: userInfo.email,
        role: userInfo.role
    }

    const token = jwt.sign(payload, process.env.TOKEN_SECRET,{
        expiresIn: "20days"
    })

    return token;
}
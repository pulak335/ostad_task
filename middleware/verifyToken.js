const jwt = require('jsonwebtoken');
const { promisify } = require('util');

exports.VerifyToken = async(req,res,next)=>{
    try {
        const token = req.headers.authorization;
        if(!token){
            res.status(401).json({
                status: 'failed',
                message: 'User not logged in !'
            }) 
        }
    
        const decoded = await promisify(jwt.verify)(token, process.env.TOKEN_SECRET)
        req.user = decoded;

        next()

    } catch (error) {
        res.status(403).json({
            status: 'failed',
            data: error.message
        })
    }
}
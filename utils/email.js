const User = require("../model/User");


 const sendMail= async(data)=>{
	
	try {
		const user = await User.findOne({email: data.email})
		
		const date = new Date()
		const time = user.emailVerifiedExpires
        const days = time.getDate()
        date.setDate(days+1)

		const url = `http://localhost:3500/api/user/confirm/${data.verifyUrl}`

		await User.updateOne({email: data.email},{$set:{verifyUrl: url, emailVerifiedExpires: date}})

		console.log(`successfully sent email to: ${data.email}`)
		console.log(url)
		return data.verifyUrl;

	} catch (error) {
		console.error(error)
	}
}

module.exports = sendMail
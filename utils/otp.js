const otpGenerator = require('otp-generator')

exports.otpGen = () =>{
    console.log('hello world');
    const otp = otpGenerator.generate(6, { digits: true ,alphabets: false,lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    const output = parseInt(otp)
    console.log(output);

    return output;
}
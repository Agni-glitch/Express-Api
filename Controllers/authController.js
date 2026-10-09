const User = require('../Models/userModel')
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const jwt = require('jsonwebtoken')
const CustomError = require('../Utils/customError');
const util = require('util');
const sendEmail = require('../Utils/email');
const crypto = require('crypto')

const signToken = id =>{
    return jwt.sign({id},process.env.SECRET_STR,{
        expiresIn:process.env.LOGIN_EXPIRES,
    })
}

const createSendResponse =(user, statusCode,res)=>{
    const token = signToken(user._id)

    // LOGIN_EXPIRES may be a timespan string like '30d', so the cookie lifetime is taken from the token itself
    const options ={
        expires:new Date(jwt.decode(token).exp*1000),
        httpOnly:true
    }

    if(process.env.NODE_ENV==='production'){
        options.secure=true
    }
    // cross site scripting attack
    res.cookie('jwt',token,options)

    user.password = undefined

    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            user
        }
    })
}

exports.createSendResponse = createSendResponse

exports.signup =asyncErrorHandler( async(req,res,next)=>{
    // role and other internal fields must not be settable by the client
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        photo:req.body.photo,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword
    })
    createSendResponse(newUser,201,res)
})

exports.login = asyncErrorHandler(async(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password

    if(!email||!password){
        const error = new CustomError('Pleas provide email id and password for logging in',400)
        return next(error)
    }

    if(typeof email!=='string'||typeof password!=='string'){
        const error = new CustomError('Incorrect email or password',400)
        return next(error)
    }

    const user =await User.findOne({email}).select('+password')
    if(!user || !(await user.comparePasswordInDb(password,user.password))){
        const error = new CustomError('Incorrect email or password',400)
        return next(error)
    }
    createSendResponse(user,200,res)
})

exports.protect = asyncErrorHandler(async(req,res,next)=>{
    const testToken = req.headers.authorization;
    let token;
    if(testToken && testToken.startsWith('Bearer ')){
        token = testToken.split(' ')[1]
    }
    if(!token){
        return next(new CustomError('You are not logged in',401))
    }
    const decodedToken =await util.promisify(jwt.verify)(token,process.env.SECRET_STR)
    const user =await User.findById(decodedToken.id)
    if(!user){
        const error= new CustomError('The user with given token not exists',401)
        return next(error)
    }
    const isPswdChanged = await user.isPasswordChanged(decodedToken.iat)
    if(isPswdChanged){
        const error = new CustomError('The password changed recently. Please login again',401)
        return next(error)
    }
    req.user = user;
    next()
})
exports.restrict =(role)=>{
    return (req,res,next)=>{
        if(req.user.role!==role){
            const error = new CustomError("You don't have permission to perform this action",403);
            return next(error);
        }
        next()
    }
}

exports.forgetPassword=asyncErrorHandler(async(req,res,next)=>{
    if(typeof req.body.email!=='string'){
        return next(new CustomError('Please provide your email id',400))
    }
    const user = await User.findOne({email:req.body.email})
    if(!user){
        const error = new CustomError("We can't find the user with given email",404)
        return next(error)
    }
    const resetToken = user.createResetPasswordToken()
    await user.save({validateBeforeSave:false})
    // with a frontend configured the link opens its reset page, otherwise it points at the API endpoint
    const resetUrl=process.env.FRONTEND_URL
        ? `${process.env.FRONTEND_URL.replace(/\/$/,'')}/reset-password/${resetToken}`
        : `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`
    const message=`We have recieved a password reset request. Please use the below link to rest your password\n\n${resetUrl}\n\nThis reset password link will be valid only for 10 minutes`
    try{
        await sendEmail({
            email:user.email,
            subject:'Password change request received',
            message:message
        })
        res.status(200).json({
            status:"success",
            message:'password reset link send to the user email'
        })
    }catch(err){
        user.passwordResetToken=undefined
        user.passwordResetTokenExpires=undefined
        await user.save({validateBeforeSave:false})
        return next(new CustomError('There was an error sending password reset email. Please try again later.',500))
    }

})
exports.passwordReset=asyncErrorHandler(async(req,res,next)=>{
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user= await User.findOne({passwordResetToken:token,passwordResetTokenExpires:{$gt:Date.now()}})
    if(!user){
        const error = new CustomError('Token is invalid or has expired!',400)
        return next(error)
    }
    user.password = req.body.password
    user.confirmPassword = req.body.confirmPassword
    user.passwordResetToken=undefined
    user.passwordResetTokenExpires = undefined
    await user.save()
    createSendResponse(user,200,res)
})

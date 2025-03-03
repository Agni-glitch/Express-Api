const User = require('../Models/userModel')
const asyncErrorHandler = require("../Utils/asyncErrorHandler");
const jwt = require('jsonwebtoken')
const util = require('util');
const customError = require('../Utils/customError');
const sendEmail = require('../Utils/email');
const crypto = require('crypto')
const authController = require('./authController')

exports.getAllUsers = asyncErrorHandler(async(req,res,next)=>{
    const users = await User.find()
    res.status(200).json({
        status:"success",
        result:users.length,
        data:{
            users
        }
    })
})

const filterReqObj =(obj,...allowedFields)=>{
    const newObj ={}
    Object.keys(obj).forEach(prop=>{
        if(allowedFields.includes(prop)){
            newObj[prop]=obj[prop]
        }
    })
    return newObj
}

exports.updatePassword = asyncErrorHandler(async (req,res,next)=>{
    const user = await User.findById(req.user._id).select('+password')
    if(!(await user.comparePasswordInDb(req.body.currentPassword, user.password))){
        return next(new customError('The current password you provided is wrong',401))
    }
    user.password = req.body.password
    user.confirmPassword = req.body.confirmPassword
    await user.save()
    authController.createSendResponse(user,200,res)
})

exports.updateMe =asyncErrorHandler(async(req,res,next)=>{
    if(req.body.password || req.body.confirmPassword){
        return next(new customError('You cannot update your password using this endpoint',400))
    }
    const filterObj = filterReqObj(req.body, 'name','email')
    const updateUser = await User.findByIdAndUpdate(req.user._id,filterObj,{runValidators:true,new:true})
    res.status(204).json({
        status:'success',
        data:{
            user:updateUser
        }
    })

})
exports.deleteMe = asyncErrorHandler(async(req,res,next)=>{
    await User.findByIdAndDelete(req.user._id,{active:false})
    res.status(204).json({
        status:'success',
        data:null
    })
})
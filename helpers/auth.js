require('dotenv').config()
const jwt=require('jsonwebtoken')
const usrModel=require('../models/user')
const adminModel=require('../models/admin')

class auth{
    createToken(data){
        return new Promise((res, rej)=>{
            jwt.sign(data, process.env.JWT_SECRET, {expiresIn:'120h'}, (err, token_value)=>{
                if(err)rej(err)
                res(token_value);
            })
        })
    }

    verifyToken(data){
        return new Promise((res, rej)=>{
            jwt.verify(data, process.env.JWT_SECRET, (err, decoded_token)=>{
                if(err){
                    rej(err)
                }else{
                    usrModel.findById(decoded_token.user, (err, user)=>{
                        if(err)rej(err)
                        res(user)
                    })
                }
            })
        })
    }

    createTokenAdmin(data){
        return new Promise((res, rej)=>{
            jwt.sign(data, process.env.JWT_SECRET, {expiresIn:'24h'}, (err, token_value)=>{
                if(err)rej(err)
                res(token_value);
            })
        })
    }

    verifyTokenAdmin(data){
        return new Promise((res, rej)=>{
            jwt.verify(data, process.env.JWT_SECRET, (err, decoded_token)=>{
                if(err){
                    rej(err)
                }else{
                    adminModel.findById(decoded_token.user, (err, admin)=>{
                        if(err)rej(err)
                        res(admin)
                    })
                }
            })
        })
    }

    mailerToken(data){
        return new Promise((resolve, reject)=>{
            jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '72h' }, (err, token_value)=>{
                if(err)reject(err)
                return resolve(token_value)
            })
        })
    }

    verifyTokenMail(token){
        return new Promise((resolve, reject) => {
            jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET, function(err, decodedToken) {
              
                if (err) {
                    reject(err);
                } else {
                    usrModel.findById(decodedToken.user, (err, user)=>{
                        if(err)reject(err)
                        resolve(user)
                    })
                }
            });
        });
    }
}

module.exports=new auth()
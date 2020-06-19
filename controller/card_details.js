const cardModel=require('../models/card_details')
const auth_user=require('../helpers/auth')
const encrypt=require('../helpers/encrypt')
const valid = require('card-validator');

class Card{
    addCard(req, res){
        var data={
            card_no:req.body.card_no,
            user:'',
            card_type:''
        }
        try{
            auth_user.verifyToken(req.token).then(user=>{
                if(user.verified){
                    var numberValidation = valid.number(data.card_no);
                    if(numberValidation.isValid==true){
                        data.user=user._id;
                        data.card_type=numberValidation.card.type
                        data.card_no=encrypt.encrypt(data.card_no)
                        cardModel.findOne({user:user._id}, (err, user_card)=>{
                            if(user_card==null){
                                cardModel.create(data, (err, card)=>{
                                    if(err){
                                        res.status(203).json({success:false, message:"error creating card", err:err})
                                    }else{
                                        res.status(200).json({success:true, message:"card added successfully"})
                                    }
                                })
                            }else{
                                res.status(203).json({success:false, message:"You can only add one card at a time. Try updating card"})
                            }
                        })
                    }else{
                        res.status(203).json({success:false, message:"invalid card type"})
                    }
                }else{
                    res.status(203).json({success:false, message:"verify account before creating card details"})
                }   
            })
        }catch(e){
            console.log(e)
            res.status(500)
        }
    }

    getCards(req, res){
        try{
            auth_user.verifyToken(req.token).then(user=>{
                cardModel.findOne({user:user._id}, (err, user_card)=>{
                    var card_info={
                        id:user_card._id,
                        card_no:encrypt.decrypt(user_card.card_no),
                        card_type:user_card.card_type,
                        auth_code:user_card.auth_code,
                        email:user_card.email
                    }
                    
                    res.status(200).json({success:true, message:card_info})
                })
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    deleteCard(req, res){
        var id={_id:req.params.id}
        try{
            auth_user.verifyToken(req.token).then(user=>{
                        cardModel.findOneAndDelete({user:user._id}, (err)=>{
                            if(err)res.status(203).json({success:false, message:"error deleting card", err:err})
                            res.status(200).json({success:true, message:"card deleted successfully"})
                        })
                    })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    addNewCard(req, res){
        var data={
            card_no:req.body.card_no,
            user:'',
            card_type:''
        }
        try{
            auth_user.verifyToken(req.token).then(user=>{
                cardModel.findOneAndDelete({user:user._id}, (err)=>{
                    if(err){
                        res.status(203).json({success:false, message:"error deleting card", err:err})
                    }else{
                        var numberValidation = valid.number(data.card_no);
                        if(numberValidation.isValid==true){
                            data.user=user._id;
                            data.card_type=numberValidation.card.type
                            data.card_no=encrypt.encrypt(data.card_no)
                            cardModel.create(data, (err, card)=>{
                                if(err){
                                    res.status(203).json({success:false, message:"error creating card", err:err})
                                }else{
                                    res.status(200).json({success:true, message:"card added successfully"})
                                }
                            })
                        }else{
                            res.status(203).json({success:false, message:"invalid card type"})
                        }
                    }
                })
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }
}
module.exports=new Card()
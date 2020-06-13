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
                        cardModel.create(data, (err, card)=>{
                            if(err){
                                res.status(203).json({success:false, message:"error creating card", err:err})
                            }else{
                                res.status(200).json({success:true, message:card})
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
                cardModel.find({user:user.id}, (err, user_card)=>{
                    var cards=[];
                    for (const a of user_card) {
                        var decrypted_value= encrypt.decrypt(a.card_no)
                        cards.push({_id:a.id, card_no:decrypted_value, card_type:a.card_type })
                    }
                    res.status(200).json({success:true, message:cards})
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
                cardModel.findById(id, (err, card_details)=>{
                    if(JSON.stringify(user._id)==JSON.stringify(card_details.user)){
                        cardModel.findByIdAndDelete(id, (err)=>{
                            if(err)res.status(203).json({success:false, message:"error deleting card", err:err})
                            res.status(200).json({success:true, message:"card deleted successfully"})
                        })
                    }else{
                        res.status(203).json({success:false, message:"unauthorized to delete card"})
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
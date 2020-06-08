var auth=require('../helpers/auth.js')

exports.verifyToken= (req, res, next)=>{
    const bearerHeader= req.headers['authorization']
        if(bearerHeader){
        var bearer= bearerHeader.split(' ')
        var token=bearer[1]
        req.token= token
        auth.verifyToken(token).then((decoded_value)=>{
            next()
        }).catch(err=>{
            res.status(205).json({message:err.message})
        })
    }else{
        res.status(205).json({ message:"please provide a token"})
        }
}

exports.verifyMail=(req, res, next)=>{
    var token =  req.query.token
    if (token){
        auth.verifyToken(token).then(decoded =>{
            next();
        }).catch(err=>{
            res.status(205).json({message:err.message})
        });
    } else{
        res.status(205).json({err: "No token provided" });
    }
}
const bcrypt=require('bcryptjs');


class hasher{
    hash_password(password){
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 15, (err, hashed)=>{
                if(err)reject(err)
                resolve(hashed)
            })
        })
    }

    compare_password(form_password, user_password){
        return new Promise((resolve, reject)=>{
            bcrypt.compare(form_password, user_password, function(err, passwordVal){
                if(err)reject(err)
                resolve(passwordVal)
            })
        })
    }
}

module.exports=new hasher()
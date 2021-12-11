const UserModel = require('../models/UserModel');

/**
 * Token setting
 * @param {String} useremail
 * @param {String} refresh_token
 * @param {String} access_token
 * @param {Number} expires_in
 */

const addToken = async (req, res) => {
    var user = new UserModel({
        email: req.body.email,
        refresh_token: req.body.refresh_token,
        access_token: req.body.access_token,
        expires_in: req.body.expires_in
    });
    let response = "";
    await user.save((err)=>{
        if(err){
            res.send({msg: err});
        }else{
            res.send({msg: 'Successfully Added!!'})
        }
    });
    return response;
}

module.exports = {
    addToken
}
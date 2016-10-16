/**
 * New node file
 */

var crypto = require('crypto'),
algorithm = 'aes-256-ctr',
password = 'd6F3Efeq';

exports.encrypt= function encrypt(text){
var cipher = crypto.createCipher(algorithm,password);
var crypted = cipher.update(text,'utf8','hex');
crypted += cipher.final('hex');
return crypted;
};
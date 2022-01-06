const { response } = require('express');
const jwt = require('jsonwebtoken');


const validarJwt = (req,res = response, next) =>{

  try {
    //Leer token
    const token = req.header('x-token');

    if(!token){
      return res.status(401).json({
        ok:false,
        msg:'No hay token en la petición',
      });
    }

    const {uid} = jwt.verify(token,process.env.JWT_SECRET);
    req.uid  = uid;

    next();
  } catch (error) {
    return res.status(401).json({
      ok:false,
      msg:'El token no es valido',
    });
  }
};


module.exports = {
  validarJwt
}
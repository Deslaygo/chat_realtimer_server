const { validationResult } = require("express-validator");


const validarCampos = (req, res, next) =>{
  const errores = validationResult(req);

  if(!errores.isEmpty()){
    return res.json({
      codigo:405,
      error:errores.mapped(),
    });
  }

  next();
};



module.exports = {
  validarCampos,
}
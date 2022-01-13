const bcrypt = require("bcryptjs/dist/bcrypt");
const { response } = require("express");
const { generarJwt } = require("../helpers/jwt");
const Usuario = require('../models/usuario');



const crearUsuario = async (req,  res = response)=>{
  try {
    //se extraen datos de request
    const { email, password } = req.body;
    const usuario = new Usuario(req.body);
    console.log(req.body);

    const existeEmail = await Usuario.findOne({ email });
    if(existeEmail){
      return res.json({
        codigo:400,
        msg:'El correo ya esta registrado',
      });
    }

    //Se genera salta para password
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    await usuario.save();

    //Se genera jwt token
    const token = await generarJwt( usuario.id );

    res.json({
      codigo:200,
      msg:'Crea usuario correctamente',
      data:{
        usuario,
        token
      }
    });
    
  } catch (error) {
    console.log(error);
    res.json({
      codigo:400,
      msg:'Ocurrio un error al crear usuario',
    })
  }

}

const login = async (req, res = response) => {
  try {
    //se extraen datos de request
    const { email, password } = req.body;
    

    const usuarioDB = await Usuario.findOne({ email });

    if(!usuarioDB){
      return res.json({
        codigo:400,
        msg:'Usuario no encontrado',
      });
    }

    //validar password
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);

    if(!validPassword){
      return res.json({
        codigo:400,
        msg:'Las credenciales son incorrectas',
      });
    }

    const token = await generarJwt(usuarioDB.id);

    res.json({
      codigo:200,
      msg:'usuario logeado correctamente',
      data:{
        usuario:usuarioDB,
        token
      }
    })
  } catch (error) {
    console.log(error);
    res.json({
      codigo:400,
      msg:'Ocurrio un error al crear usuario',
    })
  }
}

const renewToken = async (req,res = response) => {
  try {
    const uid = req.uid;
    
    const token = await generarJwt(uid);
    const usuarioDB = await Usuario.findById({_id:uid});
    res.json({
      codigo:200,
      msg:'Token renovado correctamente',
      data :{
        usuario:usuarioDB,
        token,
      }
    })
  } catch (error) {
    console.log(error);
    res.json({
      codigo:400,
      msg:'Ocurrio un error al renovar token',
    })
  }
}


module.exports = {
  crearUsuario,
  login,
  renewToken
};
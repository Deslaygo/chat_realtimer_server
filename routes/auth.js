/*

  path: api/login


*/

const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, login, renewToken } = require('../controllers/auth_controller');
const { validarCampos } = require('../middlewares/validar_campos');
const { validarJwt } = require('../middlewares/validar_jwt');

const router = Router();

router.post('/new',[
  check('nombre','El nombre es requerido').not().isEmpty(),
  check('email','El email es requerido').not().isEmpty(),
  check('email','El email no es valido').isEmail(),
  check('password','El password es requerido').not().isEmpty(),
  check('password','El password requiere mínimo 5 caracteres').isLength({min:5}),
  validarCampos,
],crearUsuario);

router.post('/',[
  check('email','El email es requerido').not().isEmpty(),
  check('email','El email no es valido').isEmail(),
  check('password','El password es requerido').not().isEmpty(),
  validarCampos,
],login);

router.get('/renew', validarJwt, renewToken);


module.exports = router;
var express = require('express');
var router = express.Router();
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { check } = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const { esRolValido, emailExiste, idUsuarioExiste } = require('../helpers/db-validators');

/* GET users listing. */
router.get('/', async(req, res, next)=> {

  const { limit=5, init = 0 } = req.query;
  const estado = {estado:true};
  
 /*  const usuarios = await Usuario.find(estado)
  .skip(Number(init))
  .limit(Number(limit));
  
  const totalReg = await Usuario.countDocuments(estado); */

  const [totalReg, usuarios] = await Promise.all([
    Usuario.countDocuments(estado),
    Usuario.find(estado)
      .skip(Number(init))
      .limit(Number(limit))

  ]);

  res.json({
    totalReg,
    usuarios
  });
});

router.post('/',[
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'Minimo 6 caracteres').isLength({min:6}),
  check("correo","Email ingresado no es valido").isEmail(),
  check("correo").custom( emailExiste),
  check('rol').custom( esRolValido ),
  /* check('rol', 'Ingrese un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE', 'USER_TEMP']), */
  validarCampos, ],  async (req, res, next)=> {

  const {nombre, correo, password, rol} = req.body;
  const usuario = new Usuario( {nombre, correo, password, rol} );

  //verificar si el correo existe
  //encriptar la contraseña
  
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);
    console.log(usuario);

    const response = await usuario.save().catch( (error)=>{console.log(error);});
    
    console.log(response);

   /*  if (response){
      res.json({
        response
      });
    }else{
      res.json({
        response:"algo fallo"
      });
    } */
    
     res.json({
      response: response ? response:"Datos duplicados o erroneos"
    }); 
});

router.put('/:id', [
  check('id', 'No es un ID valido').isMongoId(),
  check('id').custom( idUsuarioExiste ),
  check('rol').custom( esRolValido ),
  validarCampos
], async (req, res, next)=> {

  const { id } = req.params;
  const { _id, password, google, ...resto } = req.body;
  
  if (password){
    const salt = bcryptjs.genSaltSync(10);
    resto.password = bcryptjs.hashSync(password, salt);}

  const usuarioUpdate = await Usuario.findByIdAndUpdate( id, resto );
  console.log({usuarioUpdate});

  res.json({
    mensaje : `Usuario con Id ${id} actualizado correctamente`,
    usuarioUpdate
  });
});

router.delete('/:id', [
  check('id', 'No es un ID valido').isMongoId(),
  check('id').custom( idUsuarioExiste ),
  validarCampos
], async(req, res, next)=> {
 
  const { id } = req.params;
  //borar fisicamente, o borrado real
  /* const usuario = await Usuario.findByIdAndDelete(id); */
  const usuario = await Usuario.findByIdAndUpdate( id, { estado : false });
 
  res.json({
    /* info : `usuario Id ${id} eliminado de la base de datos`, */
    usuario});
});

module.exports = router;

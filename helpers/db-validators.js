const Rol = require('../models/role');
const Usuario = require('../models/usuario');


const esRolValido = async(rol = '')=>{
    const existeRol = await Rol.findOne({rol});
    if(!existeRol){
      throw new Error(`El rol ${rol} no es valido`);
    }
}

const emailExiste = async( email = '' ) => {

  const existeEmail = await Usuario.findOne({email:email});
  if( existeEmail ){
    throw new Error(`El email ${email} ya se encuentra registrado en la base da datos`);
  }
}

const idUsuarioExiste = async( id ) => {

  const existeIdUsuario = await Usuario.findById(id);
  if( !existeIdUsuario ){
    throw new Error(`El id ${id} no existe`);
  }
}

module.exports = {
    esRolValido,
    emailExiste,
    idUsuarioExiste
}
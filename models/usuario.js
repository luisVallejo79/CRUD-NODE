const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        require: (true, 'Nombre requerido'),
    },

    correo: {
        type: String,
        require: (true, 'Email requerido'),
        unique: true
    },

    password: {
        type: String,
        require: (true, 'Password requerido'),
    },

    img: {
        type: String,
    },

    rol: {
        type: String,
        require: true,
        rol: ['ADMIN_ROL', 'USER_ROL']
    },

    estado: {
        type: Boolean,
        default: true
    },

    google: {
        type: Boolean,
        default: true
    },

});

UsuarioSchema.methods.toJSON = function() {
    const { __v, password, ...usuario  } = this.toObject();
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema)
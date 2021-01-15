const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");


const crearUsuario = async (req, res = response) =>{

    const {email, password} = req.body;

    try {

        const existeEmail =  await Usuario.findOne({email});
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: "Credenciales no validas"
            });
        }

        const usuario = new Usuario(req.body);

        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        //generar json web token JWT
        const token = await generarJWT(usuario.id);

        
        res.json({
            ok:true,
            body: usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error contacte con el admin"
        });
    }

}


const loginUsuario = async (req, res = response) =>{

    const {email, password} = req.body;

    try {

        const usuarioDB = await Usuario.findOne({email});

        // validar email 

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: "Error contacte con el admin"
            });
        }
        
        //validar password

        const validarPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validarPassword) {
            return res.status(404).json({
                ok: false,
                msg: "Error contacte con el admin"
            });
        }

        //generar json web token JWT
        const token = await generarJWT(usuarioDB.id);

        
        res.json({
            ok:true,
            body: usuarioDB,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error contacte con el admin"
        });
    }

}

const renewToken = async (req, res = response) =>{
    
    //
    const uid = req.uid;
    //generar json web token JWT
    const token = await generarJWT(uid);

    const usuario = await Usuario.findById(uid);



    try {

        res.json({
            ok:true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error contacte con el admin"
        });
    }

}

module.exports = {
    crearUsuario,
    loginUsuario,
    renewToken
}
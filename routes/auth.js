//path: api/login

const { Router } = require("express");
const { check } = require("express-validator");
const { crearUsuario, loginUsuario, renewToken } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");


const router = Router();

router.post("/new", [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty().isLength({ min: 5 }),
    validarCampos
], crearUsuario);

router.post("/", [
    check("email", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty().isLength({ min: 5 }),
    validarCampos
], loginUsuario);

router.get("/renew", validarJWT, renewToken);


module.exports = router;
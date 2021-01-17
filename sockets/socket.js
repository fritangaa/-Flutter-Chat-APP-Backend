const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');
const { comprobarJWT } = require('../helpers/jwt');

const {io} = require('../index');

// Mensajes de sockets 
io.on('connection', client => {
    //console.log("Cliente conectado");
    //cliente comn jwt 
    const [valido, uid] = comprobarJWT(client.handshake.headers["x-token"]);
    //console.log(valido, uid);
    //verificar auth
    if (!valido) {return client.disconnect();}

    //cliente auth
    usuarioConectado(uid);
    //console.log("Cliente autenticado");

    //ingresar al usuario a una sala 
    //sala global io.emint, presonaliizar client.emit, 6001e3eea26b3b4a0ccb9a6b de la base de datos
    client.join(uid);

    client.on("mensaje-personal", async (payload) =>{
        
        //grabar mensaje
        await grabarMensaje(payload);

        io.to( payload.para ).emit("mensaje-personal", payload);
    })

    //client.to(uid).emit();

    client.on('disconnect', () => {
        //console.log("Cliente desconectado");
        usuarioDesconectado(uid);
    });

});

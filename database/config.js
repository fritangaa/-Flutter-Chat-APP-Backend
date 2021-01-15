const mongoose = require("mongoose");

const dbConnection = async() =>{

    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });

        console.log("DB Online");
    } catch (error) {
     console.log(error);
     throw new Error("Error en base de datos, contacte con el admin");
    }

}

module.exports = {
    dbConnection
}
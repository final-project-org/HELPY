const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_URL, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log('Succesfully connected to DB ');

    } catch (error) {
        console.log('Error connecting DB', error);
    }
};

module.exports = connectDB;
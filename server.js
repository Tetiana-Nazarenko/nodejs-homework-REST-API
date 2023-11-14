const mongoose = require('mongoose');

const app = require('./app');

const DB_HOST =
    'mongodb+srv://nnn27725:bOlXabXbzr849Voo@cluster0.p6nkayh.mongodb.net/';

mongoose
    .connect(DB_HOST)
    .then(() => {
        console.log('Database connection successful');
        app.listen(3000, () => {
            console.log('Server running. Use our API on port: 3000');
        });
    })
    .catch(error => {
        console.log(error.message);
        process.exit(1);
    });

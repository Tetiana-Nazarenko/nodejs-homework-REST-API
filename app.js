const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const mongoose = require('mongoose');

const contactsRouter = require('./routes/api/contacts');

const DB_HOST =
    'mongodb+srv://nnn27725:bOlXabXbzr849Voo@cluster0.p6nkayh.mongodb.net/';

mongoose
    .connect(DB_HOST)
    .then(() => console.log('Database connection successful'))
    .catch(error => {
        console.log(error.message);
        process.exit(1);
    });

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);

app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

module.exports = app;

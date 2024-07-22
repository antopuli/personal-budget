const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const morgan = require('morgan');
app.use(morgan('dev'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const EnvelopesRouter = require('./EnvelopesRouter');
app.use('/envelopes', EnvelopesRouter);

app.use((err, req, res, next) => {
    res.status(err.status || 500).send(err.message);
});
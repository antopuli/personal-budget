const express = require('express');
const app = express();

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const morgan = require('morgan');
app.use(morgan('dev'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
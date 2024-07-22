const express = require('express');
const EnvelopesRouter = express.Router();

const { envelopes } = require('./data');
const { Envelope } = require("./db");

EnvelopesRouter.get('/', (req, res, next) => {

    const envelopesJSON = JSON.stringify(envelopes.map(
        (envelope, index) => {
            return {
                'id' : index + 1,
                'title' : envelope.title,
                'targets' : envelope.targets.map(
                    (target, index) => {
                        return {
                            'id' : index,
                            'year' : target.year,
                            'month' : target.month,
                            'amount' : target.amount
                        }
                    }
                )
            }
        }
    ));

    res.send(envelopesJSON);

});


EnvelopesRouter.post('/', (req, res, next) => {

    // Body validation

    if (!req.body.hasOwnProperty('title')) {

        let invalidDataError = new Error('Invalid data.');
        invalidDataError.status = 400;
        return next(invalidDataError);

    }


    // Create Envelope instance

    const id = envelopes.length + 1;
    const newEnvelope = new Envelope(id, req.body.title, []);


    // Add Envelope 

    envelopes.push(newEnvelope);


    // Send Envelope

    let envelopeJSON = JSON.stringify({
        'id' : id,
        'title' : newEnvelope.title,
        'targets' : newEnvelope.targets
    });

    res.status(201).send(envelopeJSON);

});


module.exports = EnvelopesRouter;
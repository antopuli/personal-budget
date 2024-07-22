const express = require('express');
const EnvelopesRouter = express.Router();

const { envelopes } = require('./data');

EnvelopesRouter.get('/', (req, res, next) => {

    const envelopesJSON = JSON.stringify(envelopes.map(
        (envelope, index) => {
            return {
                'id' : index,
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

})

module.exports = EnvelopesRouter;
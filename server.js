const express = require("express");
const app = express();

/* 

TODO:
- It is necessary to add a property to the Budget class to face
those situations when we need to aggregate Available Targets

*/

// Listening
require("dotenv").config();
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Logging
const morgan = require("morgan");
app.use(morgan("dev"));

// Body Parsing
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Envelopes Router
const EnvelopesRouter = require("./routers/EnvelopesRouter");
app.use("/envelopes", EnvelopesRouter);

// Budgets Router
const BudgetsRouter = require('./routers/BudgetsRouter');
app.use('/budgets', BudgetsRouter);

// Targets Router
const TargetsRouter = require('./routers/TargetsRouter');
app.use('/targets', TargetsRouter);

// Transactions Router
const TransactionsRouter = require('./routers/TransactionsRouter');
app.use('/transactions', TransactionsRouter); 

// Error Handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message);
});

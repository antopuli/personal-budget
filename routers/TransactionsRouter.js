const express = require("express");
const TransactionsRouter = express.Router();

const { targets, budgets, transactions } = require("../data");
const { Transaction } = require("../db");

function validation(req, res, next) {
  try {
    Transaction.validateReqBody(req.body);
    req.id_target = Transaction.getTargetId(
      targets,
      req.body.month,
      req.body.year,
      req.body.envelope
    );
    next();
  } catch (err) {
    return next(err);
  }
}

TransactionsRouter.param("id", (req, res, next, id) => {
  try {
    req.transactionIndex = Transaction.validateId(id, transactions);
    next();
  } catch (err) {
    return next(err);
  }
});

// Retrive Transactions
TransactionsRouter.get("/", (req, res, next) => {
  const transactionsJSON = JSON.stringify(
    transactions.map((transaction) => {
      return {
        id: transaction.id,
        title: transaction.title,
        description: transaction.description,
        id_target: transaction.id_target,
        day: transaction.day,
        amount: transaction.amount,
      };
    })
  );

  res.send(transactionsJSON);
});

// Create Transaction
TransactionsRouter.post("/", validation, (req, res, next) => {
  try {
    const newTransaction = new Transaction(
      transactions.length + 1,
      req.body.title,
      req.body.description,
      req.id_target,
      req.body.day,
      req.body.amount
    );

    newTransaction.createTransaction(targets, budgets);

    transactions.push(newTransaction);

    res.status(201).send(
      JSON.stringify({
        id: newTransaction.id,
        title: newTransaction.title,
        description: newTransaction.description,
        id_target: newTransaction.id_target,
        day: newTransaction.day,
        amount: newTransaction.amount,
      })
    );
  } catch (err) {
    return next(err);
  }
});

// Modify Transaction
TransactionsRouter.put("/:id", validation, (req, res, next) => {
  try {
    const newTransaction = new Transaction(
      req.transactionIndex + 1,
      req.body.title,
      req.body.description,
      req.id_target,
      req.body.day,
      req.body.amount
    );

    transactions[req.transactionIndex].removeTransaction(targets, budgets);
    newTransaction.createTransaction(targets, budgets);

    transactions[req.transactionIndex] = newTransaction;

    res.send(
      JSON.stringify({
        id: newTransaction.id,
        title: newTransaction.title,
        description: newTransaction.description,
        id_target: newTransaction.id_target,
        day: newTransaction.day,
        amount: newTransaction.amount,
      })
    );
  } catch (err) {
    return next(err);
  }
});

// Delete Transaction
TransactionsRouter.delete("/:id", (req, res, next) => {

    transactions[req.transactionIndex].removeTransaction(targets, budgets);
    transactions.splice(req.transactionIndex, 1);
    res.status(204).send();

})

module.exports = TransactionsRouter;

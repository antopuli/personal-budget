const express = require("express");
const BudgetsRouter = express.Router();

const { budgets } = require("../data");
const { Budget } = require("../db");

BudgetsRouter.param("month", (req, res, next) => {
  const budgetIndex = budgets.findIndex(
    (budget) => budget.month === req.params.month
  );
  if (budgetIndex === -1) {
    let budgetNotFoundError = new Error("Budget not found.");
    budgetNotFoundError.status = 404;
    return next(budgetNotFoundError);
  }

  req.budgetIndex = budgetIndex;
  next();
});

// Retrive Budgets
BudgetsRouter.get("/", (req, res, next) => {
  const budgetsJSON = JSON.stringify(
    budgets.map((budget) => {
      return {
        month: budget.month,
        budget: budget.budget,
      };
    })
  );

  res.send(budgetsJSON);
});

// Create Budget
BudgetsRouter.post("/", (req, res, next) => {
  // Validate Body

  if (
    !(
      req.body.hasOwnProperty("year") &&
      req.body.hasOwnProperty("month") &&
      req.body.hasOwnProperty("budget")
    )
  ) {
    let invalidDataError = new Error("Invalid Data.");
    invalidDataError.status = 400;
    return next(invalidDataError);
  }

  // Create a new Budget instance

  const newBudget = new Budget(
    `${req.body.year}-${req.body.month}`,
    req.body.budget
  );

  // Verify Uniqueness

  for (const budget of budgets) {
    if (newBudget.month === budget.month) {
      let budgetExistsError = new Error("Budget already exists.");
      budgetExistsError.status = 409;
      return next(budgetExistsError);
    }
  }

  // Add Budget

  budgets.push(newBudget);

  // Send Budget

  let budgetJSON = JSON.stringify({
    month: newBudget.month,
    budget: newBudget.budget,
  });

  res.status(201).send(budgetJSON);
});

// Modify Budget
BudgetsRouter.put("/:month", (req, res, next) => {
  // Query Validation

  if (!req.query.hasOwnProperty("budget")) {
    let invalidDataError = new Error("Invalid data.");
    invalidDataError.status = 400;
    return next(invalidDataError);
  }

  // Budget modification

  const budgetIndex = req.budgetIndex;
  budgets[budgetIndex].budget = Number(req.query.budget);

  // Send Budget

  let budgetJSON = JSON.stringify({
    month: budgets[budgetIndex].month,
    budget: budgets[budgetIndex].budget,
  });

  res.send(budgetJSON);
});

// Delete Budget

BudgetsRouter.delete("/:month", (req, res, next) => {

    budgets.splice(req.budgetIndex, 1);
    res.status(204).send();

});

module.exports = BudgetsRouter;

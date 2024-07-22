const express = require("express");
const EnvelopesRouter = express.Router();

const { envelopes } = require("../data");
const { Envelope } = require("../db");

EnvelopesRouter.param("envelopeTitle", (req, res, next, title) => {
  const envelopeIndex = envelopes.findIndex(
    (envelope) => title === envelope.title
  );

  if (envelopeIndex === -1) {
    let invalidIDError = new Error("Envelope not found.");
    invalidIDError.status = 404;
    return next(invalidIDError);
  }

  req.envelopeIndex = envelopeIndex;
  next();
});

// Retrive Envelopes
EnvelopesRouter.get("/", (req, res, next) => {
  const envelopesJSON = JSON.stringify(
    envelopes.map((envelope) => {
      return {
        title: envelope.title,
        description: envelope.description,
        icon: envelope.icon,
      };
    })
  );

  res.send(envelopesJSON);
});

// Retrive an Envelope
/* EnvelopesRouter.get("/:envelopeID", (req, res, next) => {
  const index = req.envelopeID - 1;
  const envelopeJSON = JSON.stringify({
    id: req.envelopeID,
    title: envelopes[index].title,
    targets: envelopes[index].targets.map((target, id) => {
      return {
        id: id + 1,
        year: target.year,
        month: target.month,
        amount: target.amount,
      };
    }),
  });
  res.send(envelopeJSON);
}); */

// Create Envelope
EnvelopesRouter.post("/", (req, res, next) => {
  // Body validation

  if (
    !(
      req.body.hasOwnProperty("title") &&
      req.body.hasOwnProperty("description") &&
      req.body.hasOwnProperty("icon")
    )
  ) {
    let invalidDataError = new Error("Invalid data.");
    invalidDataError.status = 400;
    return next(invalidDataError);
  }

  // Create Envelope instance

  const newEnvelope = new Envelope(
    req.body.title,
    req.body.description,
    req.body.icon
  );

  // Verify Uniqueness

  for (const envelope of envelopes) {
    if (newEnvelope.title === envelope.title) {
      let envelopeExistsError = new Error("Envelope already exists.");
      envelopeExistsError.status = 409;
      return next(envelopeExistsError);
    }
  }

  // Add Envelope

  envelopes.push(newEnvelope);

  // Send Envelope

  let envelopeJSON = JSON.stringify({
    title: newEnvelope.title,
    description: newEnvelope.description,
    icon: newEnvelope.icon,
  });

  res.status(201).send(envelopeJSON);
});

// Create Target
/* EnvelopesRouter.post("/:envelopeID", (req, res, next) => {
  // Body Validation

  if (
    !(
      req.body.hasOwnProperty("year") &&
      req.body.hasOwnProperty("month") &&
      req.body.hasOwnProperty("amount") &&
      typeof req.body.amount === "number"
    )
  ) {
    let invalidIDError = new Error("Invalid data.");
    invalidIDError.status = 400;
    return next(invalidIDError);
  }

  // Create Target instance

  const index = req.envelopeID - 1;
  const targetID = envelopes[index].targets.length + 1;
  const newTarget = new Target(
    targetID,
    req.body.year,
    req.body.month,
    Number(req.body.amount)
  );

  // Monthly Budget Validation

  let budgetIndex;
  budgets.forEach((budget, index) => {
    if (budget.year === newTarget.year && budget.month === newTarget.month) {
      budgetIndex = index;
    }
  });

  if (!budgetIndex) {
    let budgetNotSetError = new Error(
      `Budget for ${newTarget.month} ${newTarget.year} not found.`
    );
    budgetNotSetError.status = 404;
    return next(budgetNotSetError);
  }

  if (!budgets[budgetIndex].validMonthlyBudget(newTarget.amount)) {
    let invalidAmountError = new Error(
      "You don't have enough Budget for this monthly Target"
    );
    invalidAmountError.status = 400;
    return next(invalidAmountError);
  }

  // Verify Uniqueness

  for (const target of envelopes[index].targets) {
    if (newTarget.year === target.year && newTarget.month === target.month) {
      let targetExistsError = new Error("Target already exists.");
      targetExistsError.status = 409;
      return next(targetExistsError);
    }
  }

  // Add Target

  envelopes[index].targets.push(newTarget);

  // Send Target

  let targetJSON = JSON.stringify({
    id: targetID,
    year: newTarget.year,
    month: newTarget.month,
    amount: newTarget.amount,
  });

  res.status(201).send(targetJSON);
}); */

EnvelopesRouter.put("/:envelopeTitle", (req, res, next) => {
  // Body Validation

  if (
    !(
      req.body.hasOwnProperty("title") &&
      req.body.hasOwnProperty("description") &&
      req.body.hasOwnProperty("icon")
    )
  ) {
    let invalidDataError = new Error("Invalid data.");
    invalidDataError.status = 400;
    return next(invalidDataError);
  }

  // Envelope modification

  const envelopeIndex = req.envelopeIndex;
  envelopes[envelopeIndex].title = req.body.title;
  envelopes[envelopeIndex].description = req.body.description;
  envelopes[envelopeIndex].icon = req.body.icon;

  // Send Envelope

  let envelopeJSON = JSON.stringify({
    title: envelopes[envelopeIndex].title,
    description: envelopes[envelopeIndex].description,
    icon: envelopes[envelopeIndex].icon
  });

  res.send(envelopeJSON);
});

EnvelopesRouter.delete("/:envelopeTitle", (req, res, next) => {

  envelopes.splice(req.envelopeIndex, 1);
  res.status(204).send();

});

module.exports = EnvelopesRouter;

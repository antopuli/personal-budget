const express = require("express");
const TargetsRouter = express.Router();

const { targets, budgets, envelopes } = require("../data");
const { Target } = require("../db");

TargetsRouter.param("id", (req, res, next, id) => {
  try {
    req.targetIndex = Target.validateId(id, targets);
    next();
  } catch (err) {
    return next(err);
  }
});

// Retrive Targets
TargetsRouter.get("/", (req, res, next) => {
  const targetsJSON = JSON.stringify(
    targets.map((target) => {
      return {
        id: target.id,
        month_budget: target.month_budget,
        title_envelope: target.title_envelope,
        target: target.target,
      };
    })
  );

  res.send(targetsJSON);
});

// Create Target
TargetsRouter.post("/", (req, res, next) => {
  try {
    Target.validateReqBody(req.body);

    const newTarget = new Target(
      targets.length + 1,
      `${req.body.year}-${req.body.month}`,
      req.body.title_envelope,
      req.body.target
    );

    newTarget.verifyUniqueness(targets);
    newTarget.validateTarget_envelope(envelopes);
    newTarget.validateTarget_budget(budgets);

    targets.push(newTarget);

    res.status(201).send(
      JSON.stringify({
        id: newTarget.id,
        month_budget: newTarget.month_budget,
        title_envelope: newTarget.title_envelope,
        target: newTarget.target,
      })
    );
  } catch (err) {
    return next(err);
  }
});

// Modify Target
TargetsRouter.put("/:id", (req, res, next) => {
  try {
    Target.validateReqBody(req.body);

    const newTarget = new Target(
      req.targetIndex + 1,
      `${req.body.year}-${req.body.month}`,
      req.body.title_envelope,
      req.body.target
    );

    newTarget.verifyUniqueness(targets);
    newTarget.validateTarget_envelope(envelopes);
    newTarget.validateTarget_budget(budgets);

    targets[req.targetIndex] = newTarget;

    res.send(
      JSON.stringify({
        id: newTarget.id,
        month_budget: newTarget.month_budget,
        title_envelope: newTarget.title_envelope,
        target: newTarget.target,
      })
    );
  } catch (err) {
    return next(err);
  }
});

// Delete Budget
TargetsRouter.delete("/:id", (req, res, next) => {

    targets.splice(req.targetIndex, 1);
    res.status(204).send();

});
 
module.exports = TargetsRouter;

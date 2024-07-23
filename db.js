class Budget {
  constructor(month, budget) {
    this.month = month;
    this.budget = budget;
  }
}

class Envelope {
  constructor(title, description, icon) {
    this.title = title;
    this.description = description;
    this.icon = icon;
  }
}

class Target {
  constructor(id, month_budget, title_envelope, target) {
    this.id = id;
    this.month_budget = month_budget;
    this.title_envelope = title_envelope;
    this.target = target;
  }
  validateTarget_envelope(envelopes) {
    const envelopeExists = envelopes.some(
      (envelope) => envelope.title === this.title_envelope
    );
    if (!envelopeExists) {
      let invalidEnvelope = new Error("Envelope not found.");
      invalidEnvelope.status = 404;
      throw invalidEnvelope;
    }
  }
  validateTarget_budget(budgets) {
    const budgetValue = budgets.find(
      (budget) => budget.month === this.month_budget
    );
    if (budgetValue) {
      if (budgetValue.budget - this.target < 0) {
        let invalidBudget = new Error("Invalid Budget.");
        invalidBudget.status = 400;
        throw invalidBudget;
      }
    } else {
      let budgetNotFound = new Error("Budget not found.");
      budgetNotFound.status = 404;
      throw budgetNotFound;
    }
  }
  verifyUniqueness(targets) {
    for (const target of targets) {
      if (
        this.month_budget === target.month_budget &&
        this.title_envelope === target.title_envelope
      ) {
        let budgetExistsError = new Error("Target already exists.");
        budgetExistsError.status = 409;
        throw budgetExistsError;
      }
    }
  }
  static validateReqBody(body) {
    if (
      !(
        body.hasOwnProperty("year") &&
        body.hasOwnProperty("month") &&
        body.hasOwnProperty("title_envelope") &&
        body.hasOwnProperty("target")
      )
    ) {
      let invalidDataError = new Error("Invalid Data.");
      invalidDataError.status = 400;
      throw invalidDataError;
    }
  }
  static validateId(id, targets) {
    const target = targets.findIndex((target) => String(target.id) === id);
    if (target === -1) {
      let targetNotFoundError = new Error("Target not found.");
      targetNotFoundError.status = 404;
      throw targetNotFoundError;
    } else {
      return target;
    }
  }
}

class Transaction {
  constructor(id, title, description, id_target, day, amount) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.id_target = id_target;
    this.day = day;
    this.amount = amount;
  }
  createTransaction(targets, budgets) {
    const targetIndex = targets.findIndex(
      (target) => target.id === this.id_target
    );
    targets[targetIndex].target -= this.amount;
    const budgetIndex = budgets.findIndex(
      (budget) => budget.month === targets[targetIndex].month_budget
    );
    budgets[budgetIndex].budget -= this.amount;
  }
  removeTransaction(targets, budgets) {
    const targetIndex = targets.findIndex(
        (target) => target.id === this.id_target
      );
      targets[targetIndex].target += this.amount;
      const budgetIndex = budgets.findIndex(
        (budget) => budget.month === targets[targetIndex].month_budget
      );
      budgets[budgetIndex].budget += this.amount;
  }
  static validateReqBody(body) {
    if (
      !(
        body.hasOwnProperty("title") &&
        body.hasOwnProperty("description") &&
        body.hasOwnProperty("year") &&
        body.hasOwnProperty("month") &&
        body.hasOwnProperty("day") &&
        body.hasOwnProperty("envelope") &&
        body.hasOwnProperty("amount")
      )
    ) {
      let invalidDataError = new Error("Invalid Data.");
      invalidDataError.status = 400;
      throw invalidDataError;
    }
  }
  static getTargetId(targets, month, year, envelope) {
    const target = targets.find((target) => {
      return (
        target.month_budget === `${year}-${month}` &&
        target.title_envelope === envelope
      );
    });
    if (!target) {
      let targetNotFoundError = new Error("Target not found.");
      targetNotFoundError.status = 404;
      throw targetNotFoundError;
    } else {
      return target.id;
    }
  }
  static validateId(id, transactions) {
    const transactionIndex = transactions.findIndex((transaction) => String(transaction.id) === id);
    if (transactionIndex === -1) {
      let transactionNotFoundError = new Error("Transaction not found.");
      transactionNotFoundError.status = 404;
      throw transactionNotFoundError;
    } else {
      return transactionIndex;
    }
  }
}

module.exports = {
  Budget,
  Envelope,
  Target,
  Transaction,
};

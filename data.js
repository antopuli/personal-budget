const { Budget, Envelope, Target, Transaction } = require("./db");

const budgets = [new Budget("2024-1", 2000), new Budget("2024-2", 2000)];

const envelopes = [
  new Envelope("Clothing", "Clothing description...", "👔"),
  new Envelope("Fitness", "Fitness description...", "👔"),
];

const targets = [new Target(1, "2024-1", "Clothing", 300)];

const transactions = [];

module.exports = {
  budgets,
  envelopes,
  targets,
  transactions
};

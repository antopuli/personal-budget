const { Budget, Envelope, Target } = require("./db");

const budgets = [new Budget("2024-1", 2000), new Budget("2024-2", 2000)];

const envelopes = [
  new Envelope("Clothing", "Clothing description...", "👔"),
  new Envelope("Fitness", "Fitness description...", "👔"),
];

const targets = [new Target(1, "2024-1", "Clothing", 300)];

/* const budgets = [
  new Budget(1, "2024", "July", 2000),
  new Budget(2, "2024", "August", 1800),
  new Budget(3, "2024", "September", 5800),
];

const envelopes = [
  new Envelope(1, "Clothing", [
    new Target(1, "2024", "July", 200),
    new Target(2, "2024", "August", 150),
  ]),
  new Envelope(2, "Entertainment", [
    new Target(1, "2024", "July", 150),
    new Target(2, "2024", "August", 250),
  ]),
];

const transactions = [] */

module.exports = {
  budgets,
  envelopes,
  targets
};


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

}

module.exports = {
    Budget,
    Envelope
}

class MonthlyAmount {

    #id;
    
    constructor(id, year, month, amount) {

        this.#id = id;
        this.year = year;
        this.month = month;
        this.amount = amount;

    }

}

class Budget extends MonthlyAmount {

    constructor(id, year, month, amount) {

        super(id, year, month, amount);

    }

    validMonthlyBudget(amount) {

        if ((this.amount - amount) < 0) {

            return false;

        } else {

            this.amount -= amount;
            return true;

        }

    }

}

class Target extends MonthlyAmount {

    constructor(id, year, month, amount) {

        super(id, year, month, amount);

    }

}

class Envelope {

    #id;

    constructor(id, title, targets) {
        
        this.#id = id;
        this.title = title;
        this.targets = targets;

    }

    get getId() {
        return this.#id;
    }

}


module.exports = {
    Envelope,
    Target,
    Budget
}
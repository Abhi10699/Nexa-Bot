const uuid = require('uuid');

class User {

    constructor(name,money,id){
      this.id = id;
      this.name = name;
      this.money = money;
    }

    updateMoney(newMoney){
        this.money += newMoney;
    }
}

module.exports = User
const BalanceModel = require("../models/balance");
const historyModel = require("../models/balance_history");

class Balance {
  createAccount(user) {
    var data = {
      user: user._id,
      created_at: Date.now(),
    };
    try {
      return new Promise((resolve, reject) => {
        BalanceModel.create(data, (err, balance) => {
          if (err) reject(err);
          resolve(balance);
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  getBalance(user) {
    try {
      return new Promise((resolve, reject) => {
        BalanceModel.findOne({ user: user._id }, (err, balance) => {
          if (err) reject(err);
          resolve(balance);
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  updateBalace(user, newBalance) {
    var data = {
      balance: newBalance,
    };
    try {
      return new Promise((resolve, reject) => {
        BalanceModel.findOneAndUpdate({ user: user._id }, data, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  getBalanceFromWaybill(user) {
    try {
      return new Promise((resolve, reject) => {
        historyModel.find(
          {
            $and: [{ user: user._id }, { description: "earning from waybill" }],
          },
          (err, history) => {
            if (err) {
              reject(err);
            } else {
              let earnings = history.map((a) => a.amount);
              var sum = earnings.reduce(function (a, b) {
                return a + b;
              }, 0);
              resolve(sum);
            }
          }
        );
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new Balance();

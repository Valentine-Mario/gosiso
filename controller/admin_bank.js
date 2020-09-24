const auth_user = require("../helpers/auth");
const bank_approved = require("../models/bank_details");
const bank_pending = require("../models/bank_pending_approval");
const notification = require("./notification");
const { findById, findOneAndDelete } = require("../models/bank_details");

class Bank {
  getPendingBanks(req, res) {
    var { page, limit } = req.query;
    var options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      sort: { _id: -1 },
      populate: "user",
    };
    try {
      auth_user.verifyTokenAdmin(req.token).then((user) => {
        if (user !== null) {
          bank_pending.paginate({}, options, (err, details) => {
            if (err)
              res
                .status(203)
                .json({
                  success: false,
                  message: "err retriving details",
                  err: err,
                });
            res.status(200).json({ success: true, message: details });
          });
        } else {
          res
            .status(203)
            .json({
              success: false,
              message: "unauthorized to accesss endpoint",
            });
        }
      });
    } catch (e) {
      res.status(500);
      console.log(e);
    }
  }

  getPendingBankById(req, res) {
    var id = { _id: req.params.id };
    try {
      auth_user.verifyTokenAdmin(req.token).then((user) => {
        if (user !== null) {
          bank_pending
            .findById(id, (err, details) => {
              bank_approved.findOne(
                { user: details.user },
                (err, current_details) => {
                  if (err)
                    res
                      .status(203)
                      .json({
                        success: false,
                        message: "error getting deatils",
                        err: err,
                      });
                  res
                    .status(200)
                    .json({
                      success: true,
                      pending_bank: details,
                      current_bank: current_details,
                    });
                }
              );
            })
            .populate("user");
        } else {
          res
            .status(203)
            .json({
              success: false,
              message: "unauthorized to accesss endpoint",
            });
        }
      });
    } catch (e) {
      res.status(500);
      console.log(e);
    }
  }

  changePendingStatus(req, res) {
    var data = {
      verify: req.body.verify,
    };
    var id = { _id: req.params.id };
    var new_details = {
      account_number: "",
      bank_name: "",
      created_at: "",
    };
    try {
      auth_user.verifyTokenAdmin(req.token).then((user) => {
        if (user !== null) {
          if (data.verify == "true") {
            bank_pending.findById(id, (err, bank_details) => {
              if (err) {
                res
                  .status(203)
                  .json({
                    success: false,
                    message: "error getting data",
                    err: err,
                  });
              } else {
                new_details.account_number = bank_details.account_number;
                new_details.bank_name = bank_details.bank_name;
                new_details.created_at = bank_details.created_at;
                bank_approved.findOneAndUpdate(
                  { user: bank_details.user },
                  new_details,
                  (err) => {
                    if (err) {
                      res
                        .status(203)
                        .json({
                          success: false,
                          message: "error updating details",
                          err: err,
                        });
                    } else {
                      //delete acc
                      res
                        .status(200)
                        .json({
                          success: true,
                          message: "approved successfully",
                        });
                      notification.bankChangeNotification(
                        bank_details.user,
                        "Your bank change application has been changed successfully"
                      );
                      bank_pending.findByIdAndDelete(id, (err) => {
                        //do nothing
                      });
                    }
                  }
                );
              }
            });
          } else {
            bank_pending.findById(id, (err, bank_details) => {
              if (err) {
                res
                  .status(203)
                  .json({
                    success: false,
                    message: "error getting data",
                    err: err,
                  });
              } else {
                res
                  .status(200)
                  .json({ success: true, message: "decline successful" });
                notification.bankChangeNotification(
                  bank_details.user,
                  "Your bank change application has been declined"
                );
                bank_pending.findByIdAndDelete(id, (err) => {
                  //do nothing
                });
              }
            });
          }
        } else {
          res
            .status(203)
            .json({
              success: false,
              message: "unauthorized to accesss endpoint",
            });
        }
      });
    } catch (e) {
      res.status(500);
      console.log(e);
    }
  }
}
module.exports = new Bank();

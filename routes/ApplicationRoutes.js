const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");
const TransactionController = require("../controller/TransactionController");


router.post("/", UserController.createUser);
router.patch("/:name", UserController.addAccountDetails);
router.post("/submitTransaction/", TransactionController.submitTransaction);
router.get("/:id/transactionList/", TransactionController.findTransactionsForUserById);
router.get("/:id/transactionStatus/", TransactionController.findTransactionStatusById);

module.exports = router;

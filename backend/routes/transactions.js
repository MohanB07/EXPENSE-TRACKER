const { addExpense, getExpense, deleteExpense } = require('../controllers/expense')
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income')
const { generateReport, getDropdownOptions } = require('../controllers/report');

const router = require('express').Router()


router.post('/add-income', addIncome)
    .get('/get-incomes', getIncomes)
    .delete('/delete-income/:id', deleteIncome)
    .post('/add-expense', addExpense)
    .get('/get-expenses', getExpense)
    .delete('/delete-expense/:id', deleteExpense)
    .get('/generate-report', generateReport)
    .get('/generate-report', generateReport)
    .get('/dropdown-options', getDropdownOptions)

module.exports = router


// controllers/report.js

const Income = require('../models/incomeModel');
const Expense = require('../models/expenseModel');

const generateReport = async (req, res) => {
    try {
        const { startDate, endDate, category, filterType } = req.query;

        const dateQuery = { date: { $gte: startDate, $lte: endDate } };

        let incomeData, expenseData;

        if (filterType === 'income' || filterType === 'both') {
            incomeData = await Income.find({
                title: { $regex: new RegExp(category, 'i') },
                ...dateQuery,
            }).sort({ date: 'asc' });
        }

        if (filterType === 'expense' || filterType === 'both') {
            expenseData = await Expense.find({
                title: { $regex: new RegExp(category, 'i') },
                ...dateQuery,
            }).sort({ date: 'asc' });
        }

        const totalIncome = incomeData ? incomeData.reduce((acc, income) => acc + income.amount, 0) : 0;
        const totalExpense = expenseData ? expenseData.reduce((acc, expense) => acc + expense.amount, 0) : 0;

        res.json({ incomeData, expenseData, totalIncome, totalExpense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getDropdownOptions = async (req, res) => {
    try {
        const incomeCategories = await Income.distinct('category');
        const expenseCategories = await Expense.distinct('category');

        const startDate = await Income.findOne({}, null, { sort: { 'date': 1 } }).select('date');
        const endDate = new Date();

        res.json({ incomeCategories, expenseCategories, startDate, endDate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { generateReport , getDropdownOptions };

const ExpenseSchema = require("../models/expenseModel");
const moment = require('moment');

exports.addExpense = async (req, res) => {
   const { title, amount, category, description, date } = req.body;

   // Reformat the date to ISO format
   const formattedDate = moment(date, 'DD-MM-YYYY').toDate();

   const expense = ExpenseSchema({
    title,
    amount,
    category,
    description,
    date: formattedDate // Use the reformatted date
   });

   try {
    // Validations
    if (!title || !category || !description || !formattedDate) {
        return res.status(400).json({ message: 'All fields are required!' });
    }
    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    await expense.save();
    res.status(200).json({ message: 'Expense added' });
   } catch (error) {
        // Handle errors here and send a response
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
   }

   console.log(expense);
};


exports.getExpense = async (req, res) => {
    try {
        const expenses = await ExpenseSchema.find().sort({createdAt: -1})
        res.status(200).json(expenses)
    } catch (error) {
        res.status(500).json({message: 'server error'})
    }
}

exports.deleteExpense = async (req, res) => {
    const {id} = req.params;
    ExpenseSchema.findByIdAndDelete(id)
        .then((expense) => {
            res.status(200).json({message: 'Expense deleted'})
        })
        .catch((err) => {
            res.status(500).json({message: "Server Error"})
        })
}

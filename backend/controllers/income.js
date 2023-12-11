const IncomeSchema = require("../models/incomeModel");
const moment = require('moment');

exports.addIncome = async (req, res) => {
   const { title, amount, category, description, date } = req.body;

   // Reformat the date to ISO format
   const formattedDate = moment(date, 'DD-MM-YYYY').toDate();

   const income = IncomeSchema({
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
    await income.save();
    res.status(200).json({ message: 'Income added' });
   } catch (error) {
        // Handle errors here and send a response
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
   }

   console.log(income);
};


exports.getIncomes = async (req, res) => {
    try {
        const incomes = await IncomeSchema.find().sort({createdAt: -1})
        res.status(200).json(incomes)
    } catch (error) {
        res.status(500).json({message: 'server error'})
    }
}

exports.deleteIncome = async (req, res) => {
    const {id} = req.params;
    IncomeSchema.findByIdAndDelete(id)
        .then((income) => {
            res.status(200).json({message: 'Income deleted'})
        })
        .catch((err) => {
            res.status(500).json({message: "Server Error"})
        })
}

// globalContext.js

import React, { useContext, useState } from "react";
import axios from 'axios';

const BASE_URL = "http://localhost:5000/api/v1/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomeData, setIncomeData] = useState(null);
  const [expenseData, setExpenseData] = useState(null);
  const [error, setError] = useState(null);

  const addIncome = async (income) => {
    try {
      await axios.post(`${BASE_URL}add-income`, income);
      getIncomes();
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const getIncomes = async () => {
    const response = await axios.get(`${BASE_URL}get-incomes`);
    setIncomes(response.data);
  };

  const deleteIncome = async (id) => {
    await axios.delete(`${BASE_URL}delete-income/${id}`);
    getIncomes();
  };

  const totalIncome = () => {
    return incomes.reduce((acc, income) => acc + income.amount, 0);
  };

  const addExpense = async (expense) => {
    try {
      await axios.post(`${BASE_URL}add-expense`, expense);
      getExpenses();
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const getExpenses = async () => {
    const response = await axios.get(`${BASE_URL}get-expenses`);
    setExpenses(response.data);
  };

  const deleteExpense = async (id) => {
    await axios.delete(`${BASE_URL}delete-expense/${id}`);
    getExpenses();
  };

  const totalExpenses = () => {
    return expenses.reduce((acc, expense) => acc + expense.amount, 0);
  };

  const totalBalance = () => {
    return totalIncome() - totalExpenses();
  };

  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return history.slice(0, 3);
  };

  const getDropdownOptions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}dropdown-options`);
      // Set options in your state or use them directly as needed
    } catch (error) {
      console.error(error);
      setError('Error fetching dropdown options');
    }
  };

  const generateReport = async (filterOptions) => {
    try {
      const { startDate, endDate, category, filterType } = filterOptions;

      // Fetch income data
      const incomeResponse = await axios.get(`${BASE_URL}generate-report`, {
        params: { startDate, endDate, category, filterType: 'income' },
      });

      // Fetch expense data
      const expenseResponse = await axios.get(`${BASE_URL}generate-report`, {
        params: { startDate, endDate, category, filterType: 'expense' },
      });

      // Log responses for debugging
      console.log('Income Response:', incomeResponse.data);
      console.log('Expense Response:', expenseResponse.data);

      // Check the structure of the responses
      if (incomeResponse.data.hasOwnProperty('incomeData') && expenseResponse.data.hasOwnProperty('expenseData')) {
        console.log('Income Data:', incomeResponse.data.incomeData);
        console.log('Expense Data:', expenseResponse.data.expenseData);

        // Update state with the received data
        setIncomeData(incomeResponse.data.incomeData);
        setExpenseData(expenseResponse.data.expenseData);
      } else {
        console.error('IncomeData or ExpenseData not present in the response.');
        setError('Error generating report');
      }
    } catch (error) {
      console.error(error);
      setError('Error generating report');
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        addIncome,
        getIncomes,
        incomes,
        deleteIncome,
        expenses,
        totalIncome,
        addExpense,
        getExpenses,
        deleteExpense,
        totalExpenses,
        totalBalance,
        transactionHistory,
        getDropdownOptions,
        generateReport,
        incomeData,
        expenseData,
        error,
        setError
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

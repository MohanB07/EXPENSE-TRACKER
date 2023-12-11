// Report.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';

function Report() {
    const { getDropdownOptions, generateReport, incomes, expenses, error, setError } = useGlobalContext();
    const [filterOptions, setFilterOptions] = useState({
        startDate: null,
        endDate: null,
        category: '',
        filterType: 'both', // Default to both income and expense
    });

    useEffect(() => {
        // Fetch dropdown options when the component mounts
        getDropdownOptions();
    }, []);

    const handleDateChange = (date, field) => {
        setFilterOptions({ ...filterOptions, [field]: date });
    };

    const handleSelectChange = (e) => {
        setFilterOptions({ ...filterOptions, [e.target.name]: e.target.value });
    };

    const handleGenerateReport = () => {
        generateReport(filterOptions);
    };

    return (
        <ReportContainer>
            {error && <p className='error'>{error}</p>}
            <FilterSection>
                <div className="input-control">
                    <DatePicker
                        placeholderText='Start Date'
                        selected={filterOptions.startDate}
                        dateFormat="dd/MM/yyyy"
                        onChange={(date) => handleDateChange(date, 'startDate')}
                    />
                </div>
                <div className="input-control">
                    <DatePicker
                        placeholderText='End Date'
                        selected={filterOptions.endDate}
                        dateFormat="dd/MM/yyyy"
                        onChange={(date) => handleDateChange(date, 'endDate')}
                    />
                </div>
                <div className="selects input-control">
                    <select name="filterType" value={filterOptions.filterType} onChange={handleSelectChange}>
                        <option value="both">Both</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                <div className="submit-btn">
                    <Button
                        name={'Generate Report'}
                        onClick={handleGenerateReport}
                        // Add other button props as needed
                    />
                </div>
            </FilterSection>
            {/* Display the result here */}
            <ResultSection>
                {incomes && expenses && (
                    <>
                        {incomes.map((income) => (
                            <ResultItem key={income._id}>
                                <p>Date: {new Date(income.date).toLocaleDateString()}</p>
                                <p>Title: {income.title}</p>
                                <p>Amount: ${income.amount}</p>
                            </ResultItem>
                        ))}
                        {expenses.map((expense) => (
                            <ResultItem key={expense._id}>
                                <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
                                <p>Title: {expense.title}</p>
                                <p>Amount: ${expense.amount}</p>
                            </ResultItem>
                        ))}
                    </>
                )}
            </ResultSection>
        </ReportContainer>
    );
}

const ReportContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    // Add more styling as needed
`;

const FilterSection = styled.div`
    display: flex;
    gap: 2rem;

    .input-control {
        input, select {
            font-family: inherit;
            font-size: inherit;
            outline: none;
            border: none;
            padding: .2rem 0.1rem;
            margin-left: 10px;
            width: 120px;
            border-radius: 5px;
            border: 2px solid #fff;
            background: transparent;
            resize: none;
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            color: rgba(34, 34, 96, 0.9);
            &::placeholder {
                color: rgba(34, 34, 96, 0.4);
            }
        }
    }

    .selects {
        display: flex;
        justify-content: flex-end;

        select {
            color: rgba(34, 34, 96, 0.4);
            &:focus, &:active {
                color: rgba(34, 34, 96, 1);
            }
        }
    }

    .submit-btn {
        button {
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            &:hover {
                background: var(--color-green) !important;
            }
        }
    }
`;

const ResultSection = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    // Add more styling for the result section as needed
`;

const ResultItem = styled.div`
    padding: 1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    // Add more styling for each result item as needed
`;

export default Report;


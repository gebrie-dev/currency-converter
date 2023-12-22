import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Select from 'react-select';
import { HiSwitchHorizontal } from 'react-icons/hi';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [info, setInfo] = useState([]);
  const [input, setInput] = useState('');
  const [from, setFrom] = useState('usd');
  const [to, setTo] = useState('inr');
  const [options, setOptions] = useState([]);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    Axios.get(`https://open.er-api.com/v6/latest/${from}`)
      .then((res) => {
        setInfo(res.data.rates);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching currency data:', error);
        setError('Failed to fetch currency data. Please try again.');
        setIsLoading(false);
      });
  }, [from, to]);

  useEffect(() => {
    setOptions(Object.keys(info).map((currency) => ({ value: currency, label: currency })));
    convert();
  }, [info, from, to, input, convert]);

  const customDropdownStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: '8px',
      boxShadow: 'none',
      border: '1px solid #ced4da',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      maxHeight: '200px',
      overflow: 'auto',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#590997' : 'white',
      color: state.isSelected ? 'white' : 'black',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#590997', // Adjust the color of the selected value
    }),
  };

  function convert() {
    setError('');
    const isValidInput = /^[0-9]*\.?[0-9]*$/.test(input);

    if (!isValidInput) {
      setError('Please enter a valid numeric amount.');
      setOutput('');
      return;
    }

    const rate = info[to];
    const result = parseFloat(input) * rate;

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: to,
    });

    setOutput(formatter.format(result));
  }

  function flip() {
    const temp = from;
    setFrom(to);
    setTo(temp);
    convert();
  }

  return (
    <div className="container mt-5">
      <header className="text-center mb-4">
        <h1 className="app-header">Currency Converter</h1>
      </header>
      <div className="row row-section">
        <div className="col-md-4">
          <h3>From</h3>
          <Select
            options={options}
            value={{ value: from, label: from }}
            onChange={(selectedOption) => setFrom(selectedOption.value)}
            isSearchable
            styles={customDropdownStyles}
          />
        </div>
        <div className="col-md-2">
          <div className="circle-icon">
            <HiSwitchHorizontal
              size="30px"
              onClick={() => {
                flip();
              }}
              className="mt-4"
            />
          </div>
        </div>
        <div className="col-md-4">
          <h3>To</h3>
          <Select
            options={options}
            value={{ value: to, label: to }}
            onChange={(selectedOption) => setTo(selectedOption.value)}
            isSearchable
            styles={customDropdownStyles}
          />
        </div>
      </div>
      <div className="row row-section">
        <div className="col-md-4">
          <h3>Amount</h3>
          <input
            type="text"
            className={`form-control mb-3 ${error ? 'is-invalid' : ''}`}
            placeholder="Enter the amount"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
        <div className="col-md-4 offset-md-2">
          <button
            className="btn btn-convert"
            onClick={() => {
              convert();
            }}
          >
            Convert
          </button>
        </div>
      </div>
      <div className="row row-section">
        <div className="col-md-6 offset-md-2">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="result">
              <h2>Converted Amount:</h2>
              <p>{`${input} ${from} = ${output} ${to}`}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

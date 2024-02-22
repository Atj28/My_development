import React from 'react';
import styled from 'styled-components';
import nextId from 'react-id-generator';

const Styles = styled.div`
  display: flex;
  align-items: center;

  label {
    margin-right: 10px;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 36px;
    height: 20px;
  }
  
  .switch input { 
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    transition: .4s;
    width: 16px;
    height: 16px;
    left: 2px;
    top: 2px;
    background: #FFFFFF;
    border: 2px solid #FFFFFF;
  }
  
  input:checked + .slider {
    background-color: #01668D;
  }
  
  input:focus + .slider {
    box-shadow: 0 0 1px #01668D;
  }
  
  input:checked + .slider:before {
    -webkit-transform: translateX(16px);
    -ms-transform: translateX(16px);
    transform: translateX(16px);
  }
  
  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }
  
  .slider.round:before {
    border-radius: 50%;
  }
  label {
    font-size: 14px;
    color: #014059;
  }
`
const SwitchControl = ({ value, handleChange, disabled }) => {
  const key = nextId("checked");
  const isChecked = value !== undefined ? value : false; 

  function handleToggleChange(e) {
    if (!disabled) {
      handleChange(e);
    }
  }

  return (
    <Styles disabled={disabled}>
      <label className="switch">
        <input type="checkbox" id={key} checked={isChecked} onChange={handleToggleChange} />
        <span className="slider round"></span>
      </label>
    </Styles>
  );
};

export default SwitchControl;

import React from 'react';

const Select = ({ name, label, value, error="", onChange, children }) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <select
                onChange={onChange}
                name={name}
                id={name}
                className={"form-control" + (error && " is-invalid")}
                value={value}
            >
                {children}
            </select>
            <p className="invalid-feedback">{error}</p>
        </div>
    );
};

export default Select;

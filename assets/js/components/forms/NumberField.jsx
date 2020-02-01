import React from 'react';

const NumberField = ({
   name,
   label,
   value,
   onChange,
   placeholder = "",
   type = "number",
   error = ""
}) => (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input
                value={value}
                onChange={onChange}
                type={type}
                step="0.01"
                min="0"
                placeholder={placeholder || label}
                name={name}
                id={name}
                className={"form-control" + (error && " is-invalid")}
            />
            <small id={name + "Help"} className="form-text text-muted">Vous devez mettre une virgule en cas de décimales.</small>
            {error && <p className="invalid-feedback">{error}</p>}
        </div>
    );

export default NumberField;

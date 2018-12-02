import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import moment from 'moment';

import './scss/react-editable-list.scss';
import 'react-datepicker/dist/react-datepicker.css';

export default class ReactEditableList extends React.Component {
    constructor(props) {
        super(props);

        this.onRowDelete = this.onRowDelete.bind(this);
        this.onRowChange = this.onRowChange.bind(this);
        this.isEmpty = this.isEmpty.bind(this);
        this.doesMatch = this.doesMatch.bind(this);
    }

    /**
     * When a new row is added update the state with the previous value and a new value
     */
    addNewItem() {
        let items = this.props.items;
        
        if(!items) {
            this.props.onChange([cloneDeep(this.props.itemSchema)]);
        } else {
            items.push(cloneDeep(this.props.itemSchema));
            this.props.onChange(items);
        }
    }

    /**
     * When a row is deleted remove it from the state and update
     * @param  {Number} index
     */
    onRowDelete(index) {
        let items = this.props.items;

        this.props.onRemove(items[index], index);
    }

    /**
     * When the row has changed update the state
     * @param  {Object} newRow
     * @param  {Number} index 
     */
    onRowChange(key, value, index) {
        let items = this.props.items;
        let item = JSON.parse(JSON.stringify(items[index]));
            item[key] = value;
            items[index] = item;

        this.props.onChange(items);
    }

    /**
     * When the currency field has changed update the state
     * @param  {Object} newRow
     * @param  {Number} index 
     */
    onCurrencyChange(key, value, index) {
        let items = this.props.items;
        let item = JSON.parse(JSON.stringify(items[index]));
            item[key] = value;
            items[index] = item;

        this.props.onChange(items);
    }

    /**
     * When a currency field has lost focus update the state
     * @param  {Object} newRow
     * @param  {Number} index 
     */
    onCurrencyBlur(key, value, index) {
        let items = this.props.items;
        let item = JSON.parse(JSON.stringify(items[index]));

        value = value.replace(/[$,]/g, '');
        value = isNaN(parseFloat(value)) ? 0 : value;
        value = value == "" ? "$0.00" : "$" + parseFloat(value).toFixed(2).replace(/./g, function(c, i, a) {
                return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
        });

        item[key] = value;
        items[index] = item;

        this.props.onChange(items);
    }

    /**
     * Check if the value of the key-value pair for an item is empty
     * @param {String} key 
     * @param {Integer} index 
     */
    isEmpty(key, index) {
        let item = this.props.items[index];
        let empty = item[key] === undefined ||
            item[key] === null || 
            item[key] === "" ||
            (this.props.typeSchema[key].type === "Number" && item[key] === 0)  ||
            (this.props.typeSchema[key].type === "Currency" && item[key] === "$0.00")  ||
            (Array.isArray(item[key]) && item[key].length === 0);

        return empty;
    }

    /**
     * Check if there is a give pattern to match in the type schema, and see if the key-value pair matches it
     * @param {String} key 
     * @param {Integer} index 
     */
    doesMatch(key, index) {
        let item = this.props.items[index];
        let pattern = this.props.typeSchema[key].pattern != undefined ? this.props.typeSchema[key].pattern : /.*/g;

        return typeof item[key] !== 'string' || item[key] === "" || item[key].match(pattern) !== null;
    }
    
    render() {
        return (
            <div className="EditableList">
                <div className="item-table-container">
                    {this.props.addDisabled === "" && (
                        <div className="new-item">
                            <button 
                                type="button" 
                                disabled={this.props.addDisabled} 
                                onClick={this.addNewItem.bind(this)}>
                                <span className="fa fa-plus"></span>Add new
                            </button>
                        </div>
                    )}
                    <div className="item-table" id={this.props.id}>
                        <div className="item-header item-row">
                            {Object.keys(this.props.typeSchema).map((key, i) => {
                                return (
                                    <React.Fragment key={i}>
                                        {this.props.typeSchema[key].visible && !this.props.typeSchema[key].required && (
                                            <div key={i}>{this.props.typeSchema[key].label}</div>
                                        )}
                                        {this.props.typeSchema[key].visible && this.props.typeSchema[key].required && (
                                            <div key={i}>{this.props.typeSchema[key].label}<span className="required-header">*</span></div>
                                        )}
                                    </React.Fragment>
                                )
                            })}
                            {this.props.removeDisabled === "" && (
                                <div className="remove">Remove</div>
                            )}
                        </div>
                        {this.props.items !== undefined && this.props.items !== null && (
                            <React.Fragment>
                                {this.props.items.map((item, i) => {
                                    return (
                                        <div key={i}>
                                            <div className="item-row">
                                                {Object.keys(this.props.typeSchema).map((key, j) => {
                                                    let disabled = this.props.disabled === "disabled" || this.props.typeSchema[key].editable === false ? "disabled" : "";
                                                    let required = this.props.typeSchema[key].required;
                                                    let formatted = this.props.typeSchema[key].format;

                                                    return (
                                                        <React.Fragment key={j}>
                                                            {this.props.typeSchema[key].visible && (
                                                                <div>
                                                                    {(this.props.typeSchema[key].type === "Text" || this.props.typeSchema[key].type === "Note") && (
                                                                        <input type="text" 
                                                                            value={formatted && item[key] ? formatted.replace(/value/g, item[key]) : item[key] || ""} 
                                                                            onChange={(e) => this.onRowChange(key, e.currentTarget.value, i)} 
                                                                            disabled={disabled}
                                                                            placeholder={this.props.typeSchema[key].placeholder ? this.props.typeSchema[key].placeholder : null}
                                                                            className={(this.isEmpty(key, i) && required) || !this.doesMatch(key, i) ? 'required' : ''}
                                                                        />
                                                                    )}
                                                                    {this.props.typeSchema[key].type === "Currency" && (
                                                                        <input type="text" 
                                                                            value={item[key] || ""} 
                                                                            onBlur={(e) => this.onCurrencyBlur(key, e.currentTarget.value, i)}
                                                                            onChange={(e) => this.onCurrencyChange(key, e.currentTarget.value, i)}
                                                                            disabled={disabled}
                                                                            placeholder={this.props.typeSchema[key].placeholder ? this.props.typeSchema[key].placeholder : null}
                                                                            className={(this.isEmpty(key, i) && required) || !this.doesMatch(key, i) ? 'required' : ''}
                                                                        />
                                                                    )}
                                                                    {this.props.typeSchema[key].type === "Number" && (
                                                                        <input type="number" 
                                                                            value={item[key] || ""} 
                                                                            onChange={(e) => this.onRowChange(key, e.currentTarget.value, i)} 
                                                                            disabled={disabled}
                                                                            placeholder={this.props.typeSchema[key].placeholder ? this.props.typeSchema[key].placeholder : null}
                                                                            className={(this.isEmpty(key, i) && required) || !this.doesMatch(key, i) ? 'required' : ''}
                                                                        />
                                                                    )}
                                                                    {this.props.typeSchema[key].type === "Choice" && (
                                                                        <select 
                                                                            value={item[key] || ""} 
                                                                            disabled={disabled} 
                                                                            onChange={(e) => this.onRowChange(key, e.currentTarget.value, i)}
                                                                            className={(this.isEmpty(key, i) && required) || !this.doesMatch(key, i) ? 'required' : ''}
                                                                        >
                                                                            <option value="" disabled>Please select one...</option>
                                                                            {this.props.typeSchema[key].options.map((option, k) => {
                                                                                return (
                                                                                    <option key={k} value={option.value}>{option.label}</option>
                                                                                )
                                                                            })}
                                                                        </select>
                                                                    )}
                                                                    {this.props.typeSchema[key].type === "SearchableChoice" && (
                                                                        <Select
                                                                            multi={false}
                                                                            options={this.props.typeSchema[key].options}
                                                                            value={item[key]}
                                                                            onChange={(value) => this.onRowChange(key, value, i)}
                                                                            disabled={disabled === "disabled"}
                                                                            className={(this.isEmpty(key, i) && required) || !this.doesMatch(key, i) ? 'required' : ''}
                                                                        />
                                                                    )}
                                                                    {this.props.typeSchema[key].type === "MultiChoice" && (
                                                                        <Select
                                                                            multi={true}
                                                                            options={this.props.typeSchema[key].options}
                                                                            value={item[key]}
                                                                            onChange={(value) => this.onRowChange(key, value, i)}
                                                                            disabled={disabled === "disabled"}
                                                                            className={(this.isEmpty(key, i) && required) || !this.doesMatch(key, i) ? 'required' : ''}
                                                                        />
                                                                    )}
                                                                    {this.props.typeSchema[key].type === "DateTime" && (
                                                                        <DatePicker 
                                                                            isClearable={false} 
                                                                            selected={item[key] ? moment(item[key]) : undefined } 
                                                                            onChange={(value) => this.onRowChange(key, value, i)}
                                                                            disabled={disabled === "disabled"}
                                                                            maxDate={this.props.typeSchema[key].maxDate ? moment(this.props.typeSchema[key].maxDate) : null}
                                                                            className={(this.isEmpty(key, i) && required) || !this.doesMatch(key, i) ? 'required' : ''}
                                                                        />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </React.Fragment>
                                                    )
                                                })}
                                                {this.props.removeDisabled === "" && (
                                                    <div className="remove" style={{marginTop: '5px'}}>
                                                        <span className="fa fa-trash" onClick={(e) => this.onRowDelete(i)}></span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </React.Fragment>
                        )}
                    </div>
                    {(this.props.items === undefined || this.props.items === null || isEmpty(this.props.items)) && (
                        <span style={{
                            display: 'block',
                            textAlign: 'center',
                            width: '100%',
                            fontWeight: '500',
                            padding: '4px'
                        }}
                        >
                            Add items by clicking the "add new" button
                        </span>
                    )}
                </div>
            </div>
        )
    }
}

ReactEditableList.defaultProps = {
    typeSchema: {},
    itemSchema: {},
    items: [],
    disabled: "",
    addDisabled: "",
    removeDisabled: "",
    id: ""
}

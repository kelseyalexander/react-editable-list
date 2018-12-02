# React Editable List
An editable list component for ReactJS with validation for required fields and pattern matching. Uses the react-select and react-datepicker components.

- [Properties](#properties)
- [Usage](#usage)
- [License](#license)

## Properties

| Prop Name       | Type     | Default | Description                                            |
|-----------------|----------|---------|--------------------------------------------------------|
| typeSchema      | Object   |   {}    | Definition of the data types in each item              |
| itemSchema      | Object   |   {}    | Definition of the default key-value pairs in an item   |
| items           | Array    |   []    | Array of the items to display                          |
| disabled        | String   |   ""    | Set the table controls to disabled or editable         |
| addDisabled     | String   |   ""    | Set the add new item button to disabled or editable    |
| removeDisabled  | String   |   ""    | Set the remove buttons to disabled or enabled          |
| onChange        | Function |   N/A   | Function from parent to call when item is added/edited |
| onRemove        | Function |   N/A   | Function from parent to call when item is removed      |

## Usage
```jsx

import React from 'react';
import ReactEditableList from 'react-editable-list';
import cloneDeep from 'lodash/cloneDeep';

export default class MyClass extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleRemove = this.handleRemove.bind(this);

        this.state = {
            items: [],
            types: {
                Title: {type: "Text", label: "Text", visible: true, editable: true, pattern:/Hello World!/g, required: true},
                Description: {type: "Note", label: "Description", visible: true, editable: true, required: false},
                Number: {type: "Number", label: "Number", visible: true, editable: true, required: true},
                Choice: {type: "Choice", label: "Choice", options:[
                    {label:"Red", value:"Red"}, 
                    {label:"Green", value:"Green"}, 
                    {label:"Blue", value:"Blue"}
                ], visible: true, editable: true, required: true},
                Date: {type: "DateTime", label: "Date", maxDate: new Date(), visible: true, editable: true, required: false},
                Currency: {type: "Currency", label: "Currency", visible: true, editable: true, required: true},
                Boolean: {type: "Choice", label: "Boolean", options:[
                    {label: "Yes", value:1}, 
                    {label: "No", value:0}
                ], visible: true, editable: true, required: false},
                MultiChoice: {type: "MultiChoice", label: "MultiChoice", options:[
                    {label:"Apple", value:"Apple"},
                    {label:"Orange", value:"Orange"},
                    {label:"Banana", value:"Banana"},
                    {label:"Mango", value:"Mango"},
                    {label:"Cantaloupe", value:"Cantaloupe"},
                    {label:"Watermelon", value:"Watermelon"},
                ], visible: true, editable: true, required: true},
                Lookup: {type: "SearchableChoice", label: "Lookup", options:[
                    {label:"Chicken", value:1}, 
                    {label:"Pig", value:2}, 
                    {label:"Cow", value:3}, 
                    {label:"Cat", value:4},
                    {label:"Dog", value:5},
                    {label:"Mouse", value:6},
                    {label:"Hamster", value:7}
                ], visible: true, editable: true, required: true},
            },
            item: {
                ID: null,
                Title: "",
                Description: "",
                Number: 0,
                Choice: "",
                Date: null,
                Currency: 0,
                Boolean: 0,
                MultiChoice: [],
                Lookup: null,
            }
        }
    }

    handleChange(items) {
        this.setState({items: items});
    }

    handleRemove(item, index) {
        let items = cloneDeep(this.state.items);
            items.splice(index, 1);

        this.setState({items: items});
    }

    render() {
        let disabled = '';
        let addDisabled = '';
        let removeDisabled = '';

        return(
            <div>
                <StyledContainer 
                    className='ItemTableView' 
                    id='ItemTableView'
                    title='Item Table'
                >
                    <ReactEditableList 
                        items={this.state.items}
                        typeSchema={this.state.types}
                        itemSchema={this.state.item}
                        onChange={this.handleChange}
                        onRemove={this.handleRemove}
                        disabled={disabled}
                        addDisabled={addDisabled}
                        removeDisabled={removeDisabled}
                    />
                </StyledContainer>
            </div>
        )
    }
}
```

## License
MIT Licensed.
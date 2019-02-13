import React from 'react';
import './dependents.css';

export default class Dependents extends React.Component {

  constructor(props) {
    super(props);

    //  this.state.dependents = [];
    this.state = {};
    this.state.filterText = "";
    this.state.dependents = [
    ];
  }

  componentDidMount(){
    this.setState({dependents: this.props.dependents});
  }

  componentWillReceiveProps(nextProps){
    this.setState({dependents: nextProps.dependents});
  }

  handleUserInput(filterText) {
    this.setState({filterText: filterText});
  };
  handleRowDel(dependent) {
    var index = this.state.dependents.indexOf(dependent);
    this.state.dependents.splice(index, 1);
    this.setState(this.state.dependents);
  };

  handleAddEvent(evt) {
    var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var dependent = {
      id: id,
      firstName: "",
      lastName: "",
      dob: '',
      gender: ''
    }
    this.state.dependents.push(dependent);
    this.setState(this.state.dependents);
  }

  handleDependentTable(evt) {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };
    var dependents = this.state.dependents.slice();
    var newDependents = dependents.map(function(dependent) {
      for (var key in dependent) {
        if (key === item.name && dependent.id === item.id) {
          dependent[key] = item.value;
        }
      }
      return dependent;
    });
    this.setState({dependents:newDependents});
    this.props.updateDependents(newDependents);
  };
  render() {
    return (
      <div style={{width: 800}}>
        <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput.bind(this)}/>
        <DependentsTable onDependentTableUpdate={this.handleDependentTable.bind(this)} onRowAdd={this.handleAddEvent.bind(this)} onRowDel={this.handleRowDel.bind(this)} dependents={this.state.dependents} filterText={this.state.filterText}/>
      </div>
    );
  }
}

export class SearchBar extends React.Component {
  handleChange() {
    this.props.onUserInput(this.refs.filterTextInput.value);
  }
  render() {
    return (
      <div>
        <input type="text" placeholder="Search..." value={this.props.filterText}
          ref="filterTextInput" onChange={this.handleChange.bind(this)}/>
      </div>

    );
  }

}

export class DependentsTable extends React.Component {

  render() {
    var onDependentTableUpdate = this.props.onDependentTableUpdate;
    var rowDel = this.props.onRowDel;
    var filterText = this.props.filterText;
    var dependent = this.props.dependents.map(function(dependent) {
      if (dependent.firstName.indexOf(filterText) === -1) {
        return '';
      }
      return (<DependentRow onDependentTableUpdate={onDependentTableUpdate} dependent={dependent} onDelEvent={rowDel.bind(this)} key={dependent.id}/>)
    });
    return (
      <div>

      <button type="button" onClick={this.props.onRowAdd} className="btn btn-success pull-right">Add</button>
        <table className='dependents'>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Birth Date</th>
              <th>Gender</th>

            </tr>
          </thead>

          <tbody>
            {dependent}
          </tbody>

        </table>
      </div>
    );
  }
}

export class DependentRow extends React.Component {
  onDelEvent() {
    this.props.onDelEvent(this.props.dependent);

  }
  render() {

    return (
      <tr className="eachRow">
        <EditableCell onDependentTableUpdate={this.props.onDependentTableUpdate}
           cellData={{
          "type": "firstName",
          value: this.props.dependent.firstName,
          id: this.props.dependent.id
        }}/>
        <EditableCell onDependentTableUpdate={this.props.onDependentTableUpdate} cellData={{
          type: "lastName",
          value: this.props.dependent.lastName,
          id: this.props.dependent.id
        }}/>
        <EditableCell type='date' onDependentTableUpdate={this.props.onDependentTableUpdate} cellData={{
          type: "dob",
          value: this.props.dependent.dob,
          id: this.props.dependent.id
        }}/>
      <GenderCell onDependentTableUpdate={this.props.onDependentTableUpdate} cellData={{
          type: "gender",
          value: this.props.dependent.gender,
          id: this.props.dependent.id
        }}/>
        <td className="del-cell" style={{padding: 15}} >
          <input type="button" onClick={this.onDelEvent.bind(this)} value="X" className="del-btn"/>
        </td>
      </tr>
    );
  }
}

export class EditableCell extends React.Component {
  state ={ type: 'text'}
  componentWillMount(){
    const {type} = this.props;
    if (type !== undefined){
        this.setState({type: type});
    }
  }

  render() {
    return (
      <td style={{padding: 15}} >
        <input type={this.state.type} name={this.props.cellData.type} id={this.props.cellData.id} value={this.props.cellData.value} onChange={this.props.onDependentTableUpdate}/>
      </td>
    );
  }
}

export class GenderCell extends React.Component {

  render() {
    return (
      <td >
        <select name={this.props.cellData.type} id={this.props.cellData.id} value={this.props.cellData.value} onChange={this.props.onDependentTableUpdate}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
     </td>
    );
  }
}

import React from 'react';


export default class Dependents extends React.Component {

  constructor(props) {
    super(props);

    //  this.state.dependents = [];
    this.state = {};
    this.state.filterText = "";
    this.state.dependents = [

    ];

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
  //  console.log(this.state.dependents);
  };
  render() {

    return (
      <div>
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

        <input type="text" placeholder="Search..." value={this.props.filterText} ref="filterTextInput" onChange={this.handleChange.bind(this)}/>

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
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
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
        <EditableCell onDependentTableUpdate={this.props.onDependentTableUpdate} cellData={{
          "type": "firstName",
          value: this.props.dependent.firstName,
          id: this.props.dependent.id
        }}/>
        <EditableCell onDependentTableUpdate={this.props.onDependentTableUpdate} cellData={{
          type: "lastName",
          value: this.props.dependent.lastName,
          id: this.props.dependent.id
        }}/>
        <td className="del-cell">
          <input type="button" onClick={this.onDelEvent.bind(this)} value="X" className="del-btn"/>
        </td>
      </tr>
    );

  }

}
export class EditableCell extends React.Component {

  render() {
    return (
      <td>
        <input type='text' name={this.props.cellData.type} id={this.props.cellData.id} value={this.props.cellData.value} onChange={this.props.onDependentTableUpdate}/>
      </td>
    );

  }

}

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
/*import renderHTML from 'react-render-html';*/
import './App.css';

class ItemsTable extends React.Component {
  render() {
    return <tr id={this.props.id}><td>{this.props.name}</td><td>{this.props.price}</td><td><button id="delete-item">X</button></td></tr>;
  }
}

class App extends Component {
  state = {
    name: '',
    price: '',
  };

  componentDidMount() {
    this.callApi()
      .then(res => ReactDOM.render(res, document.getElementById('items-list')))
      .catch(err => console.log(err));
      
  }

  callApi = async () => {
    const index_response = await fetch('/api/index');
    const json = await index_response.json();
    if (index_response.status !== 200) throw Error(json.message);

    var arr = [];
    Object.keys(json).forEach(function(key) {
      arr.push(json[key]);
    });
    return <table><thead><tr><th>Name</th><th>Price</th></tr></thead><tbody>{arr.map(item => <ItemsTable key={item.Item_ID} id={item.Item_ID} name={item.Name} price={item.Price} />)}</tbody></table>;
  };

  handleSubmit = async e => {
    e.preventDefault();
    const post_response = await fetch('/api/add-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: this.state.name, price: this.state.price }),
    });
    const json = await post_response.text();
    ReactDOM.render(json, document.getElementById('post-response'));
  };

render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            My Sample Store
          </p>
        </header>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Add new inventory:</strong>
          </p>
          <label>Name
          <input
            type="text"
            id="name"
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
          />
          </label>
          <label>Price
          <input
            type="text"
            id="price"
            value={this.state.price}
            onChange={e => this.setState({ price: e.target.value })}
          />
          </label>
          <button type="submit">Submit</button>
        </form>
        <p id="post-response"></p> 
        <div id="items-list"></div>
      </div>
    );
  }
}
export default App;


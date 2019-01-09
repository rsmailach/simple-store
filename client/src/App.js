import React, { Component } from 'react';
import ReactDOM from 'react-dom';
/*import renderHTML from 'react-render-html';*/
import './App.css';

class ItemsTable extends React.Component {
  render() {
    return <tr id={this.props.id}><td>{this.props.name}</td><td>{this.props.price}</td><td><button id="delete-item" onClick={() => this.deleteItem(this.props.id)}>Delete</button></td></tr>;
  }

  async deleteItem(delete_id) {
    console.log("DELETE ID: " + delete_id);
    
    const post_response = await fetch('/api/delete-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: delete_id }),
    });
    const json = await post_response.text();
    ReactDOM.render(json, document.getElementById('delete-post-response')); 
    
  };
}

class App extends Component {
  state = {
    id: '',
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

  addItem = async e => {
    e.preventDefault();
    const post_response = await fetch('/api/add-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: this.state.name, price: this.state.price }),
    });
    const json = await post_response.text();
    ReactDOM.render(json, document.getElementById('add-post-response'));
  };



render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            My Sample Store
          </p>
        </header>
        <div id="content" class="row">
          <aside id="add-item-sidebar" class="column">
            <form onSubmit={this.addItem}>
              <p>
                <strong>Add New Inventory</strong>
              </p>
              <label>Name</label>
              <input
                class="add-item"
                type="text"
                id="name"
                value={this.state.name}
                onChange={e => this.setState({ name: e.target.value })}
              />
              <label>Price</label>
              <input
                class="add-item"          
                type="text"
                id="price"
                value={this.state.price}
                onChange={e => this.setState({ price: e.target.value })}
              />
              <button 
                type="submit">
                Add</button>
            </form>
            <p id="add-post-response" class="user-message"></p>
          </aside> 
          <div id="items" class="column"> 
            <p>
              <strong>Current Inventory</strong>
            </p>          

            <div id="items-list"></div>
            <p id="delete-post-response" class="user-message"></p>
          </div>
        </div>
      </div>
    );
  }
}
export default App;


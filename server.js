const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
var mysql = require('mysql');
var sql = '';
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "egg@PLANT32"
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/index', (req, res) => {
	sql = 'SELECT * FROM simple_store.items WHERE NOT Mark_Deleted;';
	con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });

});

app.post('/api/add-item', (req, res) => {
 try {
	sql = `INSERT INTO simple_store.items (Name, Price) VALUES ( '${req.body.name}', ${req.body.price});`;
	con.query(sql, function (err, result) {
		
		if (err) {    
			res.send(
				`I have failed to insert NAME: ${req.body.name} PRICE: ${req.body.price} because ${err}`,
			); 
			//throw err
		};

		console.log("Result: " + result);
		res.send(
			`Success! I successfully inserted NAME: ${req.body.name} PRICE: ${req.body.price}`,
		);
	});
	} catch (e) {

	}

});


app.post('/api/delete-item', (req, res) => {
 try {
	sql = `UPDATE simple_store.items SET Mark_Deleted = 1 WHERE Item_ID = ${req.body.id};`;
	con.query(sql, function (err, result) {
		
		if (err) {    
			res.send(
				`I have failed to delete ID: ${req.body.id} `
			); 
			//throw err
		};

		console.log("Result: " + result);
		res.send(
			`Success! I successfully deleted ID: ${req.body.id} `
		);
	});
	} catch (e) {
 
	}

});

app.listen(port, () => console.log(`Listening on port ${port}`));
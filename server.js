/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const axios = require('axios');
const qs = require('query-string');
const { text } = require('express');


//Create Database Connection
var pgp = require('pg-promise')();

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.
		We'll be using `db` as this is the name of the postgres container in our
		docker-compose.yml file. Docker will translate this into the actual ip of the
		container for us (i.e. can't be access via the Internet).
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab,
		we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database. We set this in the
		docker-compose.yml for now, usually that'd be in a seperate file so you're not pushing your credentials to GitHub :).
**********************/
const dev_dbConfig = {
	host: 'db',
	port: 5432,
	database: process.env.POSTGRES_DB,
	user:  process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD
};

/** If we're running in production mode (on heroku), the we use DATABASE_URL
 * to connect to Heroku Postgres.
 */
const isProduction = process.env.NODE_ENV === 'production';
const dbConfig = isProduction ? process.env.DATABASE_URL : dev_dbConfig;

// Heroku Postgres patch for v10
// fixes: https://github.com/vitaly-t/pg-promise/issues/711
if (isProduction) {
  pgp.pg.defaults.ssl = {rejectUnauthorized: false};
}

//used to be const
let db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory

app.get('/', function(req, res) {
	res.render('pages/main', {
	  my_title: "breweries home page",
	  items: '', // items.data.results
	  error: false,
	  message: ''
	});
});

app.get('/reviews', function(req, res) {
	var selectQuery = `SELECT * FROM brewery_table;`;

	db.task("/post-data", (task) => {
      return task.batch([task.any(selectQuery)]);
    })

    .then(data => {
		console.log(data[0]);
		res.render('pages/reviews',{
			my_title:"reviews page",
			brewery: data[0]
		})
    })

    .catch((err) => {
      console.log("error", err);
	  req.flash('error', err);
	  res.render('pages/reviews',{
		my_title: "reviews page",
        items: '',
        error: true,
        message: ''
	  })
    });
});

app.post('/get_feed', function(req, res) {
	var cityName = req.body.city;
	//console.log(cityName);
    if(cityName) {
		axios({
			url: 'https://api.openbrewerydb.org/breweries?by_city='+cityName+'',
			method: 'GET',
			dataType: 'json',
		})
		.then(items => {
			//console.log(items);
			res.render('pages/main', {
				my_title: "breweries home page",
				items: items.data,
				error: false,
				message: ''
			})
		})
		.catch(error => {
			console.log(error);
          	res.render('pages/main',{
            my_title: "breweries home page",
            items: '',
            error: true,
            message: ''
          })
		})
	}
});

app.post('/submit_review', function(req, res){
	const id = Date.now();
	let date_ob = new Date();
	let date = ("0" + date_ob.getDate()).slice(-2);
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	let year = date_ob.getFullYear();
	
	var fulldate = year + "-" + month + "-" + date;
	var breweryName = req.body.brew_namee;
	//console.log(breweryName);
	var breweryReview = req.body.review_review;
	//insert into table
	var insertQuery = `INSERT INTO brewery_table (id, brewery_name, review, review_date)
					   VALUES ('${id}', '${breweryName}', '${breweryReview}', '${fulldate}');`;

	// select
	var selectQuery = `SELECT * FROM brewery_table;`;

	db.task("/post-data", (task) => {
      return task.batch([task.any(insertQuery), task.any(selectQuery)]);
    })

    .then(data => {
		console.log(data[1]);
		res.render('pages/reviews',{
			my_title:"reviews page",
			brewery: data[1]
		})
    })

    .catch((err) => {
      console.log("error", err);
	  req.flash('error', err);
	  res.render('pages/reviews',{
		my_title: "reviews page",
        items: '',
        error: true,
        message: ''
	  })
    });
}); // added semi colon, was working without

app.post('/filter', function(req, res){
	var brewSearched = req.body.brewerie;
	console.log(brewSearched);
	var query = "select * from brewery_table where brewery_name = '" + brewSearched + "';";
	db.task('/post-data', task => {
		return task.batch([
			task.any(query)
		]);
	})
	.then(data => {
		console.log(data[0]);
		res.render('pages/reviews',{
			my_title:"reviews page",
			brewery: data[0]
		})
	})
	.catch((err) => {
		console.log("error", err);
		req.flash('error', err);
		res.render('pages/reviews',{
		  my_title: "reviews page",
		  items: '',
		  error: true,
		  message: ''
		})
	});
});

// app.post('/render_reviews', function(req, res){
// 	var name_of_brew = req.body.review_review;
// 	var 
// })

// app.post('/get_feed', function(req, res) {
// 	var title = req.body.title;
// 	if(title) {
// 		axios{
// 			url:
// 		}
// 	}
// })


//app.listen(3000);
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
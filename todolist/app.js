// 				***** 		SETUP 					***** 
const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const saltRounds = 10;
const myPlaintextPassword = 'fubar';
const someOtherPlaintextPassword = 'shoebill';
const c = console.log;


///       ***         setup config:      ***
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use('/', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let db = pgp('postgres://minimoe@localhost:5432/todo_db');

app.use(session({
 secret: 'ninja_turtles',
 resave: false,
 saveUninitialized: true,
 cookie: { secure: false }
}))
//        ****        setup config       ***

//createdb todo_db
let sequelize = new Sequelize('postgres://minimoe@localhost:5432/todo_db');

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

let Users = sequelize.define('users', {
  username: {
    type: Sequelize.STRING,
  },
  remote: {
    type: Sequelize.STRING
  }
});

let Posts = sequelize.define('posts', {
  description: {
    type: Sequelize.TEXT
  },
  r_userid: {
    type: Sequelize.INTEGER,
    references: {
    	model: Users,
    	key: 'id'
    }
  }
});
sequelize.sync()
// Users.create({
//   username: "Bell",
//   remote: "foobar"
// });
// Posts.create({
//   description: "some more text",
//   r_userid: 1
// })


// Posts.findAll().then(function(data){
//   c(data);
// })
let myuser;
test = Users.findById(1).then(function(data){
  // c(data.dataValues);
}).catch(function(err){
  c("error is " + err);
})
// // Users.update({
// //   username: "stefan" //set
// // },{
// //   where: {id: 1} //where
// // }
// // )
// Posts.destroy({
//   where: {
//     r_userid: myuser
//   }
// }).catch(function(err){
//   c("error destroying: " + err)
// })
myuser = Users.findAll({
  where: {
    username : "stefan"
  }
}).then(function(data){
  if(data[0] !== undefined){
    currentuser = data[0].dataValues.id;
    c(currentuser)


    Posts.destroy({
      where: {
        r_userid: currentuser
      }
    }).then(function(){
      c("foobar")
    }).catch(function(err){
      c("sum err" + err)
    })

   } //end of if  
}).catch(function(err){
  c("error finding: " + err)
})

  
setTimeout(function(){c("funbar")},3000);
Users.destroy({
  where: {
    username: "stefan"
  }
}).then(function(){

     Users.findAll({
          where: {
            username : "stefan"
          }
        }).then(function(data){
            currentuser = data
          })

}).catch(function(err){
  c("error destroying: " + err)
})

// // 				***** 		SETUP ^					***** 








app.get('/',function(req,res){
	res.render('index')
})

app.get('/dash',function(req,res){
	res.render('dashboard')
})

app.post('/signup',function(req,res){
	c(req.body)
  c()
  let user = ('$1', [req.body.username]);
  let remote = ('$1', [req.body.remote]);
   Users.create({
   username: user[0],
   remote: remote[0]
  });

});

app.post('/login',function(req,res){
	c(req.body)
});

app.post('/dashboard',function(req,res){
	c(req.body)
});

app.listen(3000);
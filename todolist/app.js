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
// // 				***** 		SETUP ^					***** 

app.get('/',function(req,res){
	res.render('index')
})

app.get('/dash',function(req,res){
   c(req.session)

    Posts.findAll({
    where: {
      r_userid: req.session.identification
     }
  }).then(function(data){
    
    let foh = {
      a: data,
      b: req.session.user
    }
      res.render('dashboard',foh)
  })

})
app.get('/last',function(req,res){
  Posts.findAll({
    where: {
      r_userid: req.session.identification
     }
  }).then(function(data){
    //dataValues.description
    res.send(data);
  });
})








app.post('/signup',function(req,res){
  let user = ('$1', [req.body.username])[0];
  let remote = ('$1', [req.body.remote])[0];
  c(user)
  c(remote)

  bcrypt.hash(remote, saltRounds, function(err, hash) {
      c(hash)
      Users.create({
       username: user,
      remote: hash
      });
  });
});

app.post('/login',function(req,res){
	c(req.body)
  let user = ('$1', [req.body.user_name])[0];
  let remote = ('$1', [req.body._remote])[0];

  myuser = Users.findAll({
    where: {
      username : user
     }
  }).then(function(data){
          c(data[0].dataValues)
           let dataremote = data[0].dataValues.remote

            
           

           if((bcrypt.compareSync(remote, dataremote)) == true){
              req.session.user = user
              req.session.identification = data[0].dataValues.id
              c(req.session.identification)
              c("user is available, user: ") 
              c(req.session.user);
               res.redirect('/dash')
            }else{
              c("incorrect password")
            }

  }).catch(function(err){
    c("error is " + err);
  })
  
});

app.post('/dashing',function(req,res){
  let description = ('$1',[req.body.description])[0];


     Posts.create({
        description: description,
        r_userid: req.session.identification
     })
});


app.delete('/update',function(req,res){
  c(typeof req.body.postid);
  c(typeof Number(req.body.postid));
   Posts.destroy({
    where: {id: req.body.postid}
   })
})




app.listen(3000);
module.exports = function(app, passport, db) {

// show the home page (login/signup buttons)
app.get('/', function(req, res) {
  res.render('index.ejs');
});

// PROFILE PAGE =========================
app.get('/profile', isLoggedIn, function(req, res) {
  // beginner note: this gets all books from the db and sends to profile.ejs
  db.collection('books').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('profile.ejs', {
      user: req.user,
      books: result // pass books array to front-end
    })
  })
})

// LOGOUT ==============================
app.get('/logout', function(req, res) {
  req.logout(() => {
    console.log('User has logged out!')
  })
  res.redirect('/')
})

// ===== BOOK CRUD ROUTES ==============

// CREATE a new book
app.post('/books', (req, res) => {
  db.collection('books').save({
    title: req.body.title,    // book title from form
    author: req.body.author,  // author from form
    read: false               // set to false when added
  }, (err, result) => {
    if (err) return console.log(err)
    console.log('book saved to db')
    res.redirect('/profile')
  })
})

// UPDATE - mark book as read or unread
app.put('/books', (req, res) => {
  db.collection('books').findOneAndUpdate(
    { title: req.body.title, author: req.body.author },
    {
      $set: {
        read: req.body.read === 'false' ? true : false
      }
    },
    {
      sort: { _id: -1 },
      upsert: false
    },
    (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    }
  )
})

// DELETE a book
app.delete('/books', (req, res) => {
  db.collection('books').findOneAndDelete(
    { title: req.body.title, author: req.body.author },
    (err, result) => {
      if (err) return res.send(500, err)
      res.send('Book deleted')
    }
  )
})

// AUTH ROUTES  =========

app.get('/login', function(req, res) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/signup', function(req, res) {
  res.render('signup.ejs', { message: req.flash('signupMessage') });
});

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------


app.get('/unlink/local', isLoggedIn, function(req, res) {
  var user = req.user;
  user.local.email = undefined;
  user.local.password = undefined;
  user.save(function(err) {
    res.redirect('/profile');
  });
});

};

// middleware to make sure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next()
  res.redirect('/')
}

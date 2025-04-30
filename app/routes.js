const { ObjectId } = require('mongodb');

module.exports = function(app, passport, db) {

  // Home
  app.get('/', (req, res) => res.render('index.ejs'));

  // Profile
  app.get('/profile', isLoggedIn, async (req, res) => {
    try {
      const books = await db.collection('books').find({ userId: req.user._id }).toArray();
      res.render('profile.ejs', { user: req.user, books });
    } catch (err) {
      console.error(err);
      res.redirect('/');
    }
  });

  // Logout
  app.get('/logout', (req, res) => {
    req.logout(() => res.redirect('/'));
  });

  // CREATE book
    app.post('/books', isLoggedIn, async (req, res) => {
    try {
      await db.collection('books').insertOne({
        userId: req.user._id,
        title: req.body.title,
        author: req.body.author,
        rating: parseInt(req.body.rating) || 0,
        read: false
      });
      res.redirect('/profile');
    } catch (err) {
      console.error(err);
      res.redirect('/profile');
    }
  });


  // UPDATE (mark as read)
    app.put('/books', isLoggedIn, async (req, res) => {
    try {
      await db.collection('books').findOneAndUpdate(
        { _id: new ObjectId(req.body.id) },
        {
          $set: {
            read: true,
            finishedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      );
      res.json('Marked Read');
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  });


  // DELETE book
  app.delete('/books', isLoggedIn, async (req, res) => {
    try {
      await db.collection('books').deleteOne({ _id: new ObjectId(req.body.id) });
      res.json('Deleted');
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  });

  // Auth
  app.get('/login', (req, res) => res.render('login.ejs', { message: req.flash('loginMessage') }));
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/signup', (req, res) => res.render('signup.ejs', { message: req.flash('signupMessage') }));
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // Unlink
  app.get('/unlink/local', isLoggedIn, async (req, res) => {
    try {
      req.user.local.email = undefined;
      req.user.local.password = undefined;
      await req.user.save();
      res.redirect('/profile');
    } catch (err) {
      console.error(err);
      res.redirect('/profile');
    }
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

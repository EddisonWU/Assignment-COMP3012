const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => res.render("login", {
  errInfo: '',
}));
router.post('/login', (req, res, next) => {
  try {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.render("login", {
          errInfo: err.message,
        }) // 处理错误
      }
      if (!user) {
        return res.render("login", {
          errInfo: "Your login details are not valid. Please try again",
        }) // 处理错误
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.render("login", {
            errInfo: err.message,
          })
        }
        return res.redirect('/dashboard');
      });
    })(req, res, next)
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error)
    res.redirect("/auth/login");
  }
});
// router.post('/login', passport.authenticate("local", {
//   successRedirect: "/dashboard",
//   failureRedirect: "/auth/login",
// }));
router.get('/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });
router.get('/github/callback', (req, res, next) => {
  try {
    passport.authenticate('github', (err, user, info) => {
      if (err) {
        return res.render("login", {
          errInfo: err.message,
        }) // 处理错误
      }
      if (!user) {
        return res.render("login", {
          errInfo: "Your login details are not valid. Please try again",
        }) // 处理错误
      }
      user.name = user.id
      req.logIn(user, (err) => {
        if (err) {
          return res.render("login", {
            errInfo: err.message,
          })
        }
        return res.redirect('/dashboard');
      });
    })(req, res, next)
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error)
    res.redirect("/auth/login");
  }
});


router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send('Logout error');
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;

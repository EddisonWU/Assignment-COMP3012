const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require("../middleware/checkAuth");

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

function getAdminSendInfo(req) {
  let sessions = Object.keys(req.sessionStore.sessions).map((key) => ({ ...JSON.parse(req.sessionStore.sessions[key]).passport, sessionId: key })).filter(i => i.sessionId != req.sessionID);
  let user = { ...req.user, sessionId: req.sessionID }
  return { sessions, user }
}

router.get('/admin', ensureAdmin, function (req, res) {
  res.render('admin', { errInfo: '', ...getAdminSendInfo(req) });
});
router.get('/admin/revoke/:sessionId', ensureAdmin, function(req, res) {
  const sessionId = req.params.sessionId;
  req.sessionStore.destroy(sessionId, function(err) {
    if (err) {
      console.error(err);
      res.render('admin', { errInfo: 'Error revoking login.',  ...getAdminSendInfo(req) })
    } else {
      res.render('admin', { errInfo: '',  ...getAdminSendInfo(req) })
    }
  });
});

module.exports = router;

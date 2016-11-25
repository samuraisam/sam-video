var express = require('express');
var router = express.Router();
var apiKey = process.env.MAILGUN_KEY;
var domain = process.env.MAILGUN_DOMAIN;
var mailgun = require("mailgun-js")({apiKey: apiKey, domain: domain});
var siteKey = process.env.RECAPTCHA_KEY;
var secret = process.env.RECAPTCHA_SECRET;
var recaptcha2 = require('recaptcha2')
var recaptcha = new recaptcha2({siteKey: siteKey, secretKey: secret});

router.post('/', function(req, res, next) {
  var data = {
    from: 'SAM VIDEO <sam+video@'+domain+'>',
    to: req.body.email,
    subject: 'new contact from ' + req.body.name + ' at ' + req.body.company,
    text: 'product:\n' + req.body.product + '\nwhyus:\n' + req.body.whyus
  };
  console.log('data', data);
  console.log('recaptcha', req.body['g-recaptcha-response']);
  try {
    recaptcha.validate(req.body['g-recaptcha-response']).then(function() {
      mailgun.messages().send(data, function(err,bod) {
        console.log('mailgun err:', err, 'mailgun body:', bod);
      });
    }).catch(function() {
      console.log("recaptcha error:", arguments);
    });
  } catch(e) {
    console.error(e);
  }
});

module.exports = router;

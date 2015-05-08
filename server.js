var Hapi = require('hapi');
var Joi = require('joi');
var Irc = require('irc');

var server = new Hapi.Server();
var client = new Irc.Client('irc.freenode.net', 'rest1459', {
  autoConnect: false
});

server.connection({
  address: process.env.IP || '0.0.0.0',
  port: parseInt(process.env.PORT || 10) || 3000
});

server.route({
  method: 'GET',
  path: '/say',
  handler: function(request, reply) {
    client.say('#pdxbots', request.query.text);
    reply('Sent message: ' + request.query.text);
  },
  config: {
    validate: {
     query: {
       text: Joi.string().required().min(1).max(80)
     }
   }
  }
});

client.addListener('message', function (from, to, text) {
  console.log(from + ' => ' + to + ': ' + text);
});

client.connect(function () {
  client.join('#pdxbots', function () {
    server.start();
  });
});




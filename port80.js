var express = require('express');

var app = express();

app.get('/.well-known/acme-challenge/rHXloLz-70WCizs4MUHXm-FBX62d-FAiqJyECU3VJdM', function(req, res){
        res.send('rHXloLz-70WCizs4MUHXm-FBX62d-FAiqJyECU3VJdM.7plHcwztJk3IQihbfNNGOnRr-WS4tjSCCPKopa2jy3o');
});


//
// Platform Service App
//
app.listen(process.env.PORT || 80);

process.on('uncaughtException', function (err) {
        console.error(' ');
        console.error('----- ' + (new Date).toUTCString() + ' ----------------------------------')
        console.error('Erro uncaughtException: ', err.message)
        console.error(err.stack)
        console.error(' ');
        return
});



var express = require('express');
var app = express();
var onoff = require('onoff');
var bodyParser = require('body-parser');


var Gpio = onoff.Gpio;
var led = new Gpio(4, 'out');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
});

app.post('/process_post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
        method: "post",
        first_name: req.body.first_name,
        last_name: req.body.last_name
    };

    var value = (led.readSync() + 1) % 2; //#D
    led.write(value, function() { //#E
        console.log("Changed LED state to: " + value);
    });

    console.log(response);
    res.end(JSON.stringify(response));
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)

});

process.on('SIGINT', function () { //#F
    clearInterval(interval);
    led.writeSync(0); //#G
    led.unexport();
    console.log('Bye, bye!');
    process.exit();
});
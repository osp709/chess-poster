var fs = require('fs')
var pgnParser = require('pgn-parser')
var request = require('request')
date = new Date()

fs.readFile('./Mate.pgn', (err, data) => {
    if (err) throw err;
    out = []
    pgn = data.toString().replace(/(\r\n|\n|\r)/gm, "").split(/\*(?=\[)/g)
    pgnParser((err, parser) => {
        var a = pgn.length
        for (i = 0; i < a; i++) {
            const [result] = parser.parse(pgn[i] + "\n*");
            newdate = new Date()
            console.log(newdate.toISOString())
            newdate.setHours(date.getHours() + i + 1)
            out.push({
                "move": result.headers.Black,
                "result": result.headers.White,
                "FEN": result.headers.FEN
            })

            var options = {
                method: 'POST',
                url: 'https://api.bufferapp.com/1/updates/create.json',
                headers: {
                    'Postman-Token': '53ba8a7c-5c8d-47b9-8edf-0a9c5424445a',
                    'cache-control': 'no-cache',
                    'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                },
                formData: {
                    text: result.headers.Black + ' ' + result.headers.White,
                    'profile_ids[]': '5cdd01f4544e497c71619352',
                    'media[photo]': 'https://backscattering.de/web-boardimage/board.png?fen=' + result.headers.FEN.split(' ')[0],
                    access_token: '1/d41b516c72dc3dd3cb8263a123dfb07d',
                    scheduled_at: newdate.toISOString()
                }
            };

            request(options, function(error, response, body) {
                if (error) throw new Error(error);

                console.log(body);
            });
        }
    });
})
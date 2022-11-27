import express from 'express'

export default function webserver() {
    const app = express()
    app.get('/', function (req, res) {
        res.send(
            '<p>This is the monitoring server for the Vinci discord bot!</p><br><p>If you see this, the bot is up and running.</p>'
        );
    });
    
    app.listen(process.env.PORT || 7272, () =>
        console.log('The webserver is listening')
    );
}
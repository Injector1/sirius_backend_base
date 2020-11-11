const nanoid = require('nanoid')
const Link = require('../models/link')

module.exports = function (app, db) {
    app.post('/shorten', (req, res) => {
        // Создаем укороченную ссылку
        console.log(req.headers.host)
        const link = Link({
            shortenedUrl: `https://${req.headers.host}/${nanoid.nanoid(8)}`,
            urlToShorten: req.body.urlToShorten
        })
        console.log(link)
        console.log(req.body)
        db.collection('links').insert(link, (err, result) => {
            if (err) {
                res.send({
                    error: true,
                    status: 'Bad Request'
                })
            } else {
                res.send({
                    "status": "Created",
                    "shortenedUrl": link.shortenedUrl
                })
            }
        })
    })

    app.get("/:url", (req, res) => {
        // Получаем полную ссылку по укороченной
        const details = {shortenedUrl: `https://${req.headers.host}/${req.params.url}`}
        db.collection('links').findOne(details, (err, item) => {
            if (err) {
                res.send({"error": 'An error has occurred'})
            } else {
                res.send({
                    redirectTo: item.urlToShorten
                })
                const link = Link({
                    _id: item._id,
                    shortenedUrl: item.shortenedUrl,
                    urlToShorten: item.urlToShorten,
                    views: item.views + 1
                })
                db.collection('links').updateOne(details, link, (err, result) => {
                    if (err) console.log("An error occurred while updating link views")
                    else console.log(`Link ${link.shortenedUrl} was viewed ${link.views} times`)
                })
            }
        })
    })

    app.get("/:url/views", (req, res) => {
        // Получить количество переходов по ссылке
        const details = {shortenedUrl: `https://${req.headers.host}/${req.params.url}`}
        db.collection('links').findOne(details, (err, item) => {
            if (err) {
                res.send({
                    error: true,
                    status: 'Bad Request'
                })
            } else {
                res.send({
                    "viewsCount": item.views
                })
            }
        })
    })

}
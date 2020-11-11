const nanoid = require('nanoid')
const Link = require('../models/link')

module.exports = function (app) {
    app.post('/shorten', async (req, res) => {
        // Создаем укороченную ссылку
        const link = Link({
            shortenedUrl: `https://${req.headers.host}/${nanoid.nanoid(8)}`,
            urlToShorten: req.body.urlToShorten
        })
        await link.save((err) => {
            if (err) return console.log(err);
            res.send(link)
        })
    })

    app.get("/:url", async (req, res) => {
        // Получаем полную ссылку по укороченной

        const requestedUrl = `https://${req.headers.host}/${req.params.url}`

        const link = await Link.findOne({shortenedUrl: requestedUrl}, (err, link) => {
            if (err) return console.log(err)
            res.send({redirectTo: link.urlToShorten})
        })
        link.views += 1
        await link.save()
    })

    app.get("/:url/views", async (req, res) => {
        // Получить количество переходов по ссылке
        const requestedUrl = `https://${req.headers.host}/${req.params.url}`

        await Link.findOne({shortenedUrl: requestedUrl}, (err, link) => {
            if (err) return console.log(err)
            res.send({viewsCount: link.views})
        })
    })

}
const nanoid = require('nanoid')
const Link = require('../models/link')

module.exports = function (app) {
    app.post('/shorten', async (req, res) => {
        // Создаем укороченную ссылку
        const existedLink = await Link.findOne({urlToShorten: req.body.urlToShorten})

        if (existedLink) {
            return res.send({
                status: "Link already exists",
                shortenedUrl: existedLink.shortenedUrl
            })
        }
        const link = Link({
            shortenedUrl: `https://${req.headers.host}/${nanoid.nanoid(8)}`,
            urlToShorten: req.body.urlToShorten
        })
        await link.save((err) => {
            if (err) return console.log(err);
            res.send({
                status: "Created",
                shortenedUrl: link.shortenedUrl
            })
        })
    })

    app.get("/:url", async (req, res) => {
        // Получаем полную ссылку по укороченной
        const requestedUrl = `https://${req.headers.host}/${req.params.url}`
        const link = await Link.findOne({shortenedUrl: requestedUrl})

        if (!link) {
            return res
                .status(404)
                .send({
                    error: true,
                    status: 'Not Found'
                })
        }
        res
            .status(301)
            .header(
                'Location', link.urlToShorten
            )
            .send({
                redirectTo: link.urlToShorten
            })
        link.views++
        await link.save()
    })

    app.get("/:url/views", async (req, res) => {
        // Получить количество переходов по ссылке
        const requestedUrl = `https://${req.headers.host}/${req.params.url}`
        const link = await Link.findOne({shortenedUrl: requestedUrl})

        if (!link) {
            return res
                .status(404)
                .send({
                    status: "Link does not exist"
                })
        }
        res.send({viewsCount: link.views})
    })

}
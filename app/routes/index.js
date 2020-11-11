const linksRoutes = require('./links_routes')

module.exports = function (app, db) {
    linksRoutes(app, db)
}
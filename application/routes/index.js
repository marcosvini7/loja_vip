module.exports = app => {

	app.get('/', (req, res) => {
		app.application.controllers.index.indexController(req, res)
	})
}
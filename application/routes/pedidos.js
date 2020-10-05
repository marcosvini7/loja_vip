module.exports = app => {
	app.get('/pedidos', (req, res) => {
		app.application.controllers.pedidos.pedidosController(req, res, app)
	})
}
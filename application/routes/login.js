module.exports = app => {

	app.get('/login', (req, res) => {
		app.application.controllers.login.loginController(req, res)
	})

	app.get('/cadastro', (req, res) => {
		app.application.controllers.login.cadastroController(req, res)
	})

	app.post('/cadastrar', (req, res) => {
		app.application.controllers.login.cadastrarController(req, res, app)
	})

	app.post('/entrar', (req, res) => {
		app.application.controllers.login.entrarController(req, res, app)
	})

	app.get('/sair', (req, res) => {
		app.application.controllers.login.sairController(req, res, app)
	})

}
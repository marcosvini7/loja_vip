module.exports = function(app){

	app.get('/admin', (req, res) => {
		app.application.controllers.admin.adminController(req, res)
	})

	app.post('/admin/cadastrar_produto', function(req, res) {
		app.application.controllers.admin.cadastrar_produto(req, res, app)
	})

	app.get('/admin/form_cadastro_produto', function(req, res) {
		app.application.controllers.admin.form_cadastro_produto(req, res)
	})

	app.get('/admin/form_remover_produto', function(req, res) {
		app.application.controllers.admin.form_remover_produto(req, res)
	})

	app.get('/admin/form_editar_produto', function(req, res) {
		app.application.controllers.admin.form_editar_produto(req, res)
	})

	app.get('/admin/form_edicao_produto', function(req, res) {
		app.application.controllers.admin.form_edicao_produto(req, res)
	})

	app.get('/admin/verificar_produto/:id_produto', function(req, res) {
		app.application.controllers.admin.verificar_produto(req, res, app)
	})

	app.delete('/admin/remover_produto/:id_produto/:imagem', function(req, res) {
		app.application.controllers.admin.remover_produto(req, res, app)
	})

	app.post('/admin/editar_produto', function(req, res) {
		app.application.controllers.admin.editar_produto(req, res, app)
	})

	app.get('/admin/promocao_usuario', function(req, res) {
		app.application.controllers.admin.promocao_usuario(req, res, app)
	})

	app.put('/admin/promover/:id_usuario/:nivel', function(req, res) {
		app.application.controllers.admin.promover_usuario(req, res, app)
	})

	app.get('/admin/buscar_usuario/:email', function(req, res) {
		app.application.controllers.admin.buscar_usuario(req, res, app)
	})
}
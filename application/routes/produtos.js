module.exports = app => {

	app.get('/produtos', (req, res) => {
		app.application.controllers.produtos.produtosController(req, res, app)
	})

	app.get('/produtos/:id', (req, res) => {
		app.application.controllers.produtos.produtoController(req, res, app)
	})

	app.get('/categorias/', (req, res) => {
		app.application.controllers.produtos.categoriasController(req, res)
	})

	app.get('/categorias/:categoria', (req, res) => {
		app.application.controllers.produtos.categoriaController(req, res, app)
	})

	app.get('/produtos/pesquisa/:conteudo', (req, res) => {
		app.application.controllers.produtos.pesquisaController(req, res, app)
	})

	app.put('/produto/favoritar/:id', (req, res) => {
		app.application.controllers.produtos.favoritarController(req, res, app)
	})

	app.get('/favoritos', (req, res) => {
		app.application.controllers.produtos.favoritosController(req, res, app);
	})
	app.get('/carrinho', (req, res) => {
		app.application.controllers.produtos.carrinhoController(req, res, app);
	})
	app.put('/produto/carrinho/:id', (req, res) => {
		app.application.controllers.produtos.carrinho_adicionarController(req, res, app)
	})
	app.put('/produto/enviar_avaliacao/:avaliacao/:id_produto', (req, res) => {
		app.application.controllers.produtos.enviar_avaliacao(req, res, app)	
	})
	app.get('/produto/avaliacoes/:id_produto', (req, res) => {
		app.application.controllers.produtos.avaliacoes(req, res, app)
	})

}
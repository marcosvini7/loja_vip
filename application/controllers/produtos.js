module.exports.produtosController = (req, res, app) => {
	var connection = app.config.dbConnection
	var produtoDAO = new app.application.models.produtoDAO(connection)
	produtoDAO.getProdutos(req, res)
}

module.exports.produtoController = (req, res, app) => {
	var connection = app.config.dbConnection
	var produtoDAO = new app.application.models.produtoDAO(connection)
	produtoDAO.getProduto(req, res)
}

module.exports.categoriasController = (req, res) => {
	var nome = ''
	if(req.session.autenticado){
		nome = req.session.nome
	} 

	res.render('categorias', {nome: nome})
}

module.exports.categoriaController = (req, res, app) => {
	var connection = app.config.dbConnection
	var produtoDAO = new app.application.models.produtoDAO(connection)
	produtoDAO.getProdutosPorCategoria(req, res)
}

module.exports.pesquisaController = (req, res, app) => {
	var connection = app.config.dbConnection
	var produtoDAO = new app.application.models.produtoDAO(connection)
	produtoDAO.getProdutosPorPesquisa(req, res)
}

module.exports.favoritarController = (req, res, app) => {
	var connection = app.config.dbConnection
	var produtoDAO = new app.application.models.produtoDAO(connection)
	produtoDAO.favoritarProduto(req, res)
}

module.exports.favoritosController = (req, res, app) => {
	if(req.session.autenticado){
		var connection = app.config.dbConnection
		var produtoDAO = new app.application.models.produtoDAO(connection)
		produtoDAO.getFavoritos(req, res)
	} else {
		res.redirect('/login')
	}
}

module.exports.carrinhoController = (req, res, app) => {
	if(req.session.autenticado){
		var connection = app.config.dbConnection
		var produtoDAO = new app.application.models.produtoDAO(connection)
		produtoDAO.getCarrinho(req, res)
	} else {
		res.redirect('/login')
	}
}

module.exports.carrinho_adicionarController = (req, res, app) => {
	if(req.session.autenticado){
		var connection = app.config.dbConnection
		var produtoDAO = new app.application.models.produtoDAO(connection)
		produtoDAO.carrinhoAdicionar(req, res)
	} else {
		res.redirect('/login')
	}
}

module.exports.enviar_avaliacao = (req, res, app) => {
	if(req.session.autenticado){
		var connection = app.config.dbConnection
		var produtoDAO = new app.application.models.produtoDAO(connection)
		produtoDAO.enviar_avaliacao(req, res)
	} else {
		res.redirect('/login')
	}
}

module.exports.avaliacoes = (req, res, app) => {
	var connection = app.config.dbConnection
	var produtoDAO = new app.application.models.produtoDAO(connection)
	produtoDAO.getAvaliacoes(req, res)
} 



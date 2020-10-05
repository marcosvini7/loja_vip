function validar_form_cadastro(req){
	var errors = []

	if(req.body.titulo.length == 0){
		errors.push('Titulo não pode ser vazio')
	}

	if(req.body.resumo.length == 0){
		errors.push('Resumo não pode ser vazio')
	}

	if(req.body.categoria.length == 0){
		errors.push('Categoria não pode ser vazio')
	}

	if(req.body.descricao.length == 0){
		errors.push('Descrição não pode ser vazio')
	}

	if(req.body.valor.length == 0){
		errors.push('Valor não pode ser vazio')
	}

	if(req.body.quantidade.length == 0){
		errors.push('Quantidade não pode ser vazio')
	}

	if(req.body.valor <= 0){
		errors.push('Valor deve ser maior que zero')
	}

	if(req.body.quantidade <= 0){
		errors.push('Quantidade deve ser maior que zero')
	}

	return errors
}

module.exports.adminController = (req, res) => {
	
	if(req.session.autoridade > 1){ 
		res.render('admin', {nome: req.session.nome,
			autoridade: req.session.autoridade})
	} else {
		res.redirect('/')
	}
}

module.exports.form_cadastro_produto = (req, res) => {
	if(req.session.autoridade > 1){
		res.render('form_cadastro_produto', 
			{url: "/admin/cadastrar_produto", method: "post"})
	} else {
		res.redirect('/')
	}
}

module.exports.form_editar_produto = (req, res) => {
	if(req.session.autoridade > 1){
		res.render('form_editar_produto')
	} else {
		res.redirect('/')
	}
}

module.exports.form_edicao_produto = (req, res) => {
	if(req.session.autoridade > 1){
		res.render('form_cadastro_produto', 
			{url: "/admin/editar_produto"})
	} else {
		res.redirect('/')
	}
}

module.exports.form_remover_produto = (req, res) => {
	if(req.session.autoridade > 1){
		res.render('form_remover_produto')
	} else {
		res.redirect('/')
	}
}

module.exports.remover_produto = (req, res, app) => {
	var connection = app.config.dbConnection
	var produtoDAO = new app.application.models.produtoDAO(connection)
	produtoDAO.remover_produto(req, res)
}

module.exports.verificar_produto = (req, res, app) => {
	var connection = app.config.dbConnection
	var produtoDAO = new app.application.models.produtoDAO(connection)
	produtoDAO.verificar_produto(req, res)
}

module.exports.cadastrar_produto = (req, res, app) => {
	var errors = validar_form_cadastro(req)

	if(req.files.imagem.originalFilename.length == 0){
		errors.push('Imagem é obrigatória')
	}

	if(errors.length > 0){
		res.render('admin', {errors: errors, form: req.body, 
			autoridade: req.session.autoridade})
	} else {
		var connection = app.config.dbConnection
		var produtoDAO = new app.application.models.produtoDAO(connection)
		produtoDAO.cadastrar_produto(req, res)
	}
}

module.exports.editar_produto = (req, res, app) => {
	var errors = validar_form_cadastro(req)

	if(errors.length > 0){
		res.render('admin', {errors: errors, 
			autoridade: req.session.autoridade})
	} else {
		var connection = app.config.dbConnection
		var produtoDAO = new app.application.models.produtoDAO(connection)
		produtoDAO.editar_produto(req, res)
	}
}

module.exports.promocao_usuario = (req, res, app) => {
	if(req.session.autoridade > 1){
		var connection = app.config.dbConnection
		var usuarioDAO = new app.application.models.usuarioDAO(connection)
		usuarioDAO.getUsuarios(req, res)
	} else {
		res.redirect('/')
	}
}
module.exports.promover_usuario = (req, res, app) => {
	var connection = app.config.dbConnection
	var usuarioDAO = new app.application.models.usuarioDAO(connection)
	usuarioDAO.promoverUsuario(req, res)
	
}

module.exports.buscar_usuario = (req, res, app) => {
	if(req.session.autoridade > 2){
		var connection = app.config.dbConnection
		var usuarioDAO = new app.application.models.usuarioDAO(connection)
		usuarioDAO.buscarUsuario(req, res)
	} else {
		res.redirect('/')
	}
}
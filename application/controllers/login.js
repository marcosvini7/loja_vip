var nome 

module.exports.loginController = (req, res) => {
	if(req.session.autenticado){
		nome = req.session.nome
	} else {
		nome = ''
	}
	res.render('login', {nome: nome})
}

module.exports.cadastroController = (req, res) => {	
	if(req.session.autenticado){
		nome = req.session.nome
	} else {
		nome = ''
	}
	res.render('cadastro', {nome: nome})
}

module.exports.cadastrarController = (req, res, app) => {
	if(req.session.autenticado){
		nome = req.session.nome
	} else {
		nome = ''
	}
	var errors = []

	if(req.body.nome.length < 10 || req.body.nome.length > 30){
		errors.push('O campo nome deve ter entre 10 e 30 caracteres')
	}
	if(req.body.email.length == 0){
		errors.push('E-mail não pode ficar em branco')
	}
	if(req.body.senha.length < 5 || req.body.senha.length > 15){
		errors.push('O campo senha deve ter entre 5 e 15 caracteres')
	}
	if(req.body.cidade.length == 0){
		errors.push('O CEP não pode ser inválido')
	}
	if(req.body.celular.length == 0){
		errors.push('Celular não pode ficar em branco')
	}

	if(errors.length > 0){
		res.render('cadastro', {errors: errors, nome: nome})
	} else {
		var connection = app.config.dbConnection
		var usuarioDAO = new app.application.models.usuarioDAO(connection)
		usuarioDAO.cadastrar(req, res)
	}
}

module.exports.entrarController = (req, res, app) => {
	if(req.session.autenticado){
		nome = req.session.nome
	} else {
		nome = ''
	}
	var errors = []

	if(req.body.email.length == 0){
		errors.push('E-mail não pode ficar em branco')
	}
	if(req.body.senha.length == 0){
		errors.push('Senha não pode ficar em branco')
	}

	if(errors.length > 0){
		res.render('login', {errors: errors, nome: nome})
	} else {
		var connection = app.config.dbConnection
		var usuarioDAO = new app.application.models.usuarioDAO(connection)
		usuarioDAO.entrar(req, res)
	}
}

module.exports.sairController = (req, res, app) => {
	req.session.destroy(() => {
		res.redirect('/')
	})
}
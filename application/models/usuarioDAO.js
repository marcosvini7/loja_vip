var nome 
var ObjectId = require('mongodb').ObjectId

class UsuarioDAO {

	constructor(connection){
		this.connection = connection()
	}

	cadastrar(req, res){
		if(req.session.autenticado){
			nome = req.session.nome
		} else {
			nome = ''
		}
		this.connection.open((err, mongoclient) => {
			mongoclient.collection('usuarios', (err, collection) => {
				collection.find({
					email: req.body.email
				}).toArray((err, result) => {
					if(result[0] == undefined){
						req.body.autoridade = 1
						mongoclient.collection('usuarios', (err, collection) => {			
							collection.insert(req.body, () => {
								mongoclient.collection('usuarios', (err, collection) => {
									collection.find({email: req.body.email})
										.toArray((err, result) => {	
											req.session._id = result[0]._id
											mongoclient.collection('usuarios', (err, collection) => {	
												collection.find().toArray((err, result) => {  
													var autoridade = 1	
													if(result.length == 1){
														autoridade = 4
														mongoclient.collection('usuarios', (err,collection) => {
															collection.update(
																{_id: result[0]._id},
																{$set: {autoridade: 4}},
																{}, 
																() => {
																	mongoclient.close()				
																}
															)
															
														})
													} else {
														mongoclient.close()
														autoridade = 1
													}
													req.session.favoritos = []
													req.session.carrinho = []
													req.session.autoridade = autoridade
													req.session.autenticado = true
													req.session.nome = req.body.nome
													res.redirect('/')
													
												})
											})																
										})
									})
								})
							})

					} else {
						res.render('cadastro', {errors: ['E-mail já cadastrado!'],
							nome: nome})
						mongoclient.close()
					}

				})
			})						
		})
	}

	entrar(req, res){
		if(req.session.autenticado){
			nome = req.session.nome
		}else {
			nome = ''
		}
		this.connection.open((err, mongoclient) => {
			mongoclient.collection('usuarios', (err, collection) => {
				collection.find(
					{email: req.body.email, senha: req.body.senha})
					.toArray((err, result) => {
						if(result[0] == undefined){
							res.render('login', {errors: ['E-mail ou senha inválido(s)'],
								nome: nome})
						} else { 

							if(result[0].favoritos == undefined){
								req.session.favoritos = []
							} else {
								req.session.favoritos = result[0].favoritos
							}

							if(result[0].carrinho == undefined){
								req.session.carrinho = []
							} else {
								req.session.carrinho = result[0].carrinho
							}

							req.session.autoridade = result[0].autoridade
							req.session._id = result[0]._id
							req.session.autenticado = true
							req.session.nome = result[0].nome
							res.redirect('/')
							
						}
						mongoclient.close()
				})
			})
		})
	}

	getUsuarios(req, res){
		this.connection.open((err, mongoclient) => {
			mongoclient.collection('usuarios', (err, collection) => {
				collection.find({autoridade: {$lt: req.session.autoridade}})
					.toArray((err, result) => {
						res.render('promocao_usuario', {usuarios: result})
						mongoclient.close()
					})
			})
		})
	}

	promoverUsuario(req, res){
		req.params.nivel = parseInt(req.params.nivel)
		this.connection.open((err, mongoclient) => {
			mongoclient.collection('usuarios', (err, collection) => {
				collection.update(
					{_id: ObjectId(req.params.id_usuario)},
					{$set: {autoridade: req.params.nivel}},
					{},
					() => {
						mongoclient.close()
					}
				)
				res.send(true)
			})
		})
	}

	buscarUsuario(req, res){
		this.connection.open((err, mongoclient) => {
			mongoclient.collection('usuarios', (err, collection) => {
				collection.find({email: req.params.email})
					.toArray((err, result) => {
						res.send(result[0])
						mongoclient.close()
					})
				
			})
		})
	}
}

module.exports = () => UsuarioDAO
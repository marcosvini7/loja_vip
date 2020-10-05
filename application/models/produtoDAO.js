var fs = require('fs')
var ObjectId = require('mongodb').ObjectId

class ProdutoDAO {

	constructor(connection) {
	  this.connection = connection()
	}

	cadastrar_produto(req, res){
		var data = new Date()
		var time_stamp = data.getTime()
		var arquivo = time_stamp + '_' + req.files.imagem.originalFilename 
		var path_temporario = req.files.imagem.path
		var destino = './public/imagens_produtos/' + arquivo

		var connection = this.connection
	
		fs.rename(path_temporario, destino, function(err){
			if(err){
				res.status(500).json({error: err})
				return
			}

			req.body.imagem = arquivo
			
			connection.open((err, mongoclient) => {
				mongoclient.collection('produtos', (err, collection) => {
					collection.insert(req.body, () => {
						res.render('admin', {msg: 'Produto inserido com sucesso!',
							autoridade: req.session.autoridade})
						mongoclient.close()
					})				
				})
			})
			
		})
	}

	getProdutos(req, res){
		this.connection.open((err, mongoclient) => {
			mongoclient.collection('produtos', (err, collection) => {
				collection.find().toArray((err, result) => {
					if(req.session.autenticado){
						res.render('produtos', {produtos : result, 
							nome: req.session.nome})
					} else {
						res.render('produtos', {produtos : result})
					}
					
					mongoclient.close()
				})
			})
		})
	}

	getProduto(req, res){
		var id_produto = req.params.id
		var favoritos = req.session.favoritos
		var carrinho = req.session.carrinho
		var favorito = false
		var adicionado = false

		if(favoritos != undefined){
			favoritos.forEach(produto => {
				if(produto == id_produto){
					favorito = true
				}
			})
		}

		if(carrinho != undefined){
			carrinho.forEach(produto => {
				if(produto == id_produto){
					adicionado = true
				}
			})
		}
		

		this.connection.open((err, mongoclient) => {
			mongoclient.collection('produtos', (err, collection) => {
				collection.find({_id: ObjectId(req.params.id)})
					.toArray((err, result) => {
						if(req.session.autenticado){				
							res.render('produto', {produto : result,
								nome: req.session.nome, favorito: favorito,
									adicionado: adicionado})
						} else {
							res.render('produto', {produto : result,
								favorito: favorito, adicionado: adicionado})		
						}
						mongoclient.close()
						
					})
				})
			})
	}

	verificar_produto(req, res){
		var id = null
		try {
			id = ObjectId(req.params.id_produto)
		}catch(err){
			id = ObjectId()
		}
		this.connection.open((err, mongoclient) => {
			mongoclient.collection('produtos', (err, collection) => {	
				collection.find({_id: id})
					.toArray((err, result) => {
						res.send(result)						
						mongoclient.close()
				}) 
			})
		})
	}

	remover_produto(req, res){
		fs.unlink(`./public/imagens_produtos/${req.params.imagem}`, () => {

			this.connection.open((err, mongoclient) => {
			mongoclient.collection('produtos', (err, collection) => {	
				collection.remove(
					{_id: ObjectId(req.params.id_produto)},
					() => {
						mongoclient.close()
						}
					)				 
				})
			})
		})		
	}

	editar_produto(req, res){
		if(req.files.imagem.originalFilename.length != 0){
			var data = new Date()
			var time_stamp = data.getTime()
			var arquivo = time_stamp + '_' + req.files.imagem.originalFilename 
			var path_temporario = req.files.imagem.path
			var destino = './public/imagens_produtos/' + arquivo
			
			fs.unlink(`./public/imagens_produtos/${req.body.imagem_anterior}`, () => {
				req.body.imagem = arquivo

				fs.rename(path_temporario, destino, function(err){
					if(err){
						res.status(500).json({error: err})
						return
					}
				})
			})
		} else {
			req.body.imagem = req.body.imagem_anterior
		}

		this.connection.open((err, mongoclient) => {
				mongoclient.collection('produtos', (err, collection) => {
					collection.update(
						{_id: ObjectId(req.body.id)},
						{$set: {	
							titulo: req.body.titulo,
							imagem: req.body.imagem,
							resumo: req.body.resumo,
							categoria: req.body.categoria,
							descricao: req.body.descricao,
							valor: req.body.valor,
							quantidade: req.body.quantidade
						}},
						{multi: true},
						() => {
							res.render('admin', {msg: 'Produto atualizado com sucesso',
								autoridade: req.session.autoridade})
							mongoclient.close()
						}
					)	
				})				
			})
		}

		getProdutosPorCategoria(req, res){
			var nome = ''
			if(req.session.autenticado){
				nome = req.session.nome
			}

			this.connection.open((err, mongoclient) => {
				mongoclient.collection('produtos', (err, collection) => {
					collection.find({categoria: req.params.categoria})
						.toArray((err, result) => {
							res.render('produtos', {produtos: result,
								nome: nome})

							mongoclient.close()
						})
				})
			})
		}	

		getProdutosPorPesquisa(req, res){
			var conteudo = req.params.conteudo.toUpperCase()
		
			this.connection.open((err, mongoclient) => {
				mongoclient.collection('produtos', (err, collection) => {
					collection.find().toArray((err, result) => {
							var resposta = result.filter(i => {
								var titulo = i.titulo.toUpperCase()
								var descricao = i.descricao.toUpperCase()

								return titulo.includes(conteudo)
									|| descricao.includes(conteudo)
							})
							
							res.send(resposta)

							mongoclient.close()
						})
				})
			})
		}

		favoritarProduto(req, res){
			var favoritos = req.session.favoritos
			var id_produto = req.params.id
			var acao = 'favoritar' 
			var id_usuario = req.session._id
			
			favoritos.forEach(favorito => {
				if(favorito == id_produto){
					acao = 'remover'
				}
			})
			
			this.connection.open((err, mongoclient) => {			
				mongoclient.collection('usuarios', (err, collection) => {
					if(acao == 'favoritar'){												
						collection.update(					
							{_id: ObjectId(id_usuario)},
							{$push: {favoritos: id_produto}},
							{},
							() => {		
								mongoclient.close()	
							}
						)				
						req.session.favoritos.push(id_produto)

					} else {
						
						collection.update(
							{_id: ObjectId(id_usuario)},
							{$pull: {favoritos: id_produto}},
							{},
							() => {
								mongoclient.close()	
							}
						)
						req.session.favoritos = favoritos.filter(i => {
							return i != id_produto
						})
						
					}
					res.send(acao)	
				})	
			})
		}

		getFavoritos(req, res){
			var favoritos = req.session.favoritos
			var produtos = []
			if(favoritos != undefined){	
				this.connection.open((err, mongoclient) => {				
					mongoclient.collection('produtos', (err, collection) => {
						collection.find().toArray((err, result) => {
							result.forEach(produto => {
								favoritos.forEach(favorito => {
									if(favorito == produto._id){
										produtos.push(produto)
									}
								})
							})
							res.render('favoritos', {favoritos: produtos,
							 	nome: req.session.nome})
							mongoclient.close()
						})
					})
				})
			} else {
				res.render('favoritos', {favoritos: produtos,
					nome: req.session.nome})
			}
		}

		getCarrinho(req, res){
			var carrinho = req.session.carrinho
			var produtos = []
			if(carrinho != undefined){	
				this.connection.open((err, mongoclient) => {				
					mongoclient.collection('produtos', (err, collection) => {
						collection.find().toArray((err, result) => {
							result.forEach(produto => {
								carrinho.forEach(p => {
									if(p == produto._id){
										produtos.push(produto)
									}
								})
							})
							res.render('carrinho', {carrinho: produtos,
							 	nome: req.session.nome})
							mongoclient.close()
						})
					})
				})
			} else {
				res.render('carrinho', {carrinho: produtos,
					nome: req.session.nome})
			}
		}

		carrinhoAdicionar(req, res){

			var carrinho = req.session.carrinho
			var id_produto = req.params.id
			var acao = 'adicionar' 
			var id_usuario = req.session._id

			carrinho.forEach(produto => {
				if(produto == id_produto){
					acao = 'remover'
				}
			})		

			this.connection.open((err, mongoclient) => {			
				mongoclient.collection('usuarios', (err, collection) => {
					if(acao == 'adicionar'){										
						collection.update(					
							{_id: ObjectId(id_usuario)},
							{$push: {carrinho: id_produto}},
							{},
							() => {
								mongoclient.close()	
							}
						)	
						req.session.carrinho.push(id_produto)
																
					} else {
						collection.update(
							{_id: ObjectId(id_usuario)},
							{$pull: {carrinho: id_produto}},
							{},
							() => {
								mongoclient.close()
							}
						)
						req.session.carrinho = carrinho.filter(i => {
							return i != id_produto
						})				
					}
					res.send(acao)
				})	
			})
		}

		getData(){
			var date = new Date
			var mes = date.getMonth().length > 1 ? date.getMonth()
				: '0' + date.getMonth()
			var dia = date.getDate().length > 1 ? date.getDate()
			 	: '0' + date.getDate()
			var data = dia + '/' + mes + '/' + date.getFullYear()
			var horario = date.getHours() + ':' + date.getMinutes()
			return [data, horario]
		}

		enviar_avaliacao(req, res){
			var data = this.getData()
			this.connection.open((err, mongoclient) => {			
				mongoclient.collection('produtos', (err, collection) => {
					var avaliacao = {
						id: new ObjectId(),
						id_usuario: req.session._id,
						nome_usuario: req.session.nome,
						avaliacao: req.params.avaliacao,
						data: data
					}
					collection.update(
						{_id: ObjectId(req.params.id_produto)},
						{$push: {avaliacoes: avaliacao}},
						{},
						() => {
							res.send(true)
							mongoclient.close()
						}
					)
				})
			})
		}

		getAvaliacoes(req, res){
			this.connection.open((err, mongoclient) => {
				mongoclient.collection('produtos', (err, collection) => {
					collection.find({_id: ObjectId(req.params.id_produto)})
						.toArray((err, result) => {
							res.send(result[0].avaliacoes)
							mongoclient.close()
						})
				})
			})
		}

	}
	
module.exports = () => ProdutoDAO
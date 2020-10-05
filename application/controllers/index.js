module.exports.indexController = (req, res) => {
	
	if(req.session.autenticado){
		res.render('index', {nome: req.session.nome})
	} else {
		res.render('index')
	}
}
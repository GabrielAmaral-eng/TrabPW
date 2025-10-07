const Joi = require('joi');

const LivroSchema = Joi.object({
    id: Joi.number().integer(),
    titulo: Joi.string().required(),
    autor: Joi.string().required(),
    editora: Joi.string().required(),
    ano_publicacao: Joi.number().integer().min(1000).max(2025).required(), 
    genero: Joi.string().required(),
    paginas: Joi.number().integer().required(),
    avaliacao: Joi.number().min(0).max(10).required()
});

class Livro {
    constructor(titulo, autor, editora, ano_publicacao, genero, paginas, avaliacao) {
        this.id = undefined;
        this.titulo = titulo;
        this.autor = autor;
        this.editora = editora;
        this.ano_publicacao = ano_publicacao;
        this.genero = genero;
        this.paginas = paginas;
        this.avaliacao = avaliacao;
    }

    validate() {
        return LivroSchema.validate(this, { abortEarly: false });
    }
}


module.exports = { Livro };
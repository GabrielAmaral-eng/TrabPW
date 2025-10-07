const Joi = require('joi');

const JogoSchema = Joi.object({
    id: Joi.number().integer(),
    titulo: Joi.string().required(),
    desenvolvedora: Joi.string().required(),
    plataforma: Joi.string().required(),
    ano_lancamento: Joi.number().integer().min(1950).max(2025).required(), 
    genero: Joi.string().required(),
    duracao_media_horas: Joi.number().required(),
    avaliacao: Joi.number().min(0).max(10).required() 
});

class Jogo {
    constructor(titulo, desenvolvedora, plataforma, ano_lancamento, genero, duracao_media_horas, avaliacao) {
        this.id = undefined;
        this.titulo = titulo;
        this.desenvolvedora = desenvolvedora;
        this.plataforma = plataforma;
        this.ano_lancamento = ano_lancamento;
        this.genero = genero;
        this.duracao_media_horas = duracao_media_horas;
        this.avaliacao = avaliacao;
    }

    validate() {
        return JogoSchema.validate(this, { abortEarly: false });
    }
}

module.exports = { Jogo };
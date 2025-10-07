const express = require("express");
const { Livro } = require("./Livros"); 
const { Jogo } = require("./Jogos");   
const DB = require('./database');
const { orderByAvaliacaoDesc, createSimplifiedOrderedLivroList, createSimplifiedOrderedJogoList } = require('./utilities'); 
const { corsMiddleware, logMiddleware, authorizationMiddleware } = require('./middlewares');
const { generateJWTTokenForUser } = require('./jwt');

const app = express();
app.use(express.json());


app.use(corsMiddleware)
   .use(logMiddleware)
   .use('/livros', authorizationMiddleware) 
   .use('/jogos', authorizationMiddleware);  

app.post('/authenticate', async (req, res) => {
    const { body } = req;
    if (!body) return res.status(400).send('Request body expected');

    const { api_key } = body;
    if (!api_key) return res.status(400).send('api_key expected');

    const user = await DB.getUserByApiKey(api_key);
    if (!user) return res.status(404).send('user not found for this api_key');

    generateJWTTokenForUser(user.id)
        .then(jwt => res.json({ jwt }))
        .catch(err => {
            console.log(err);
            return res.status(500).send('error generating token');
        });
});


app.get('/livros/:ID', (req, res) => {
    const { ID } = req.params;
    DB.getLivroByID(parseInt(ID))
        .then(payload => {
            if (payload) return res.json(payload);
            else return res.status(404).send('Livro não encontrado');
        })
        .catch(err => res.status(500).send('Erro ao obter os dados'));
})
.get('/livros', (req, res) => {
    createSimplifiedOrderedLivroList(DB.getLivros(), orderByAvaliacaoDesc)
        .then(payload => res.json(payload))
        .catch(err => res.status(500).send('Erro ao obter os dados'));
})
.post('/livros', (req, res) => {
    const { body } = req;
    if (!body) return res.status(400).send('Request body expected');
    
    const { titulo, autor, editora, ano_publicacao, genero, paginas, avaliacao } = body;
    const livro = new Livro(titulo, autor, editora, ano_publicacao, genero, paginas, avaliacao);
    const valid = livro.validate();

    if (Object.hasOwn(valid, 'error')) {
        const message = valid.error.details.reduce((str, item) => str + item.message + "\n", "");
        return res.status(400).send(message);
    }

    DB.addLivro(livro).then((id) => {
        return res.status(201).json({ id }); 
    }).catch((err) => {
        console.log(err);
        return res.status(500).send('Erro ao inserir livro');
    });
})
.put('/livros/:ID', async (req, res) => {
    const { ID } = req.params;
    const { body } = req;

    if (!ID) return res.status(400).send('É necessário fornecer o ID');

    const livro = await DB.getLivroByID(parseInt(ID));
    if (!livro) return res.status(404).send('Livro não encontrado');
    if (!body) return res.status(400).send('Request body expected');

    const { titulo, autor, editora, ano_publicacao, genero, paginas, avaliacao } = body;
    const newLivro = new Livro(titulo, autor, editora, ano_publicacao, genero, paginas, avaliacao);
    const valid = newLivro.validate();

    if (Object.hasOwn(valid, 'error')) {
        const message = valid.error.details.reduce((str, item) => str + item.message + "\n", "");
        return res.status(400).send(message);
    }

    await DB.deleteLivro(parseInt(ID));

    DB.insertLivro(parseInt(ID), newLivro)
        .then(l => res.status(200).json(l))
        .catch(err => {
            console.log(err);
            res.status(500).send('Erro ao alterar o livro ' + ID);
        });
})
.delete('/livros/:ID', async (req, res) => {
    const { ID } = req.params;
    if (!ID) return res.status(400).send('É necessário fornecer o ID');

    const livro = await DB.getLivroByID(parseInt(ID));
    if (!livro) return res.status(404).send('Livro não encontrado');

    DB.deleteLivro(parseInt(ID)).then(() => res.status(200).send('Livro removido'));
});


app.get('/jogos/:ID', (req, res) => {
    const { ID } = req.params;
    DB.getJogoByID(parseInt(ID))
        .then(payload => {
            if (payload) return res.json(payload);
            else return res.status(404).send('Jogo não encontrado');
        })
        .catch(err => res.status(500).send('Erro ao obter os dados'));
})
.get('/jogos', (req, res) => {
    createSimplifiedOrderedJogoList(DB.getJogos(), orderByAvaliacaoDesc)
        .then(payload => res.json(payload))
        .catch(err => res.status(500).send('Erro ao obter os dados'));
})
.post('/jogos', (req, res) => {
    const { body } = req;
    if (!body) return res.status(400).send('Request body expected');
    
    const { titulo, desenvolvedora, plataforma, ano_lancamento, genero, duracao_media_horas, avaliacao } = body;
    const jogo = new Jogo(titulo, desenvolvedora, plataforma, ano_lancamento, genero, duracao_media_horas, avaliacao);
    const valid = jogo.validate();

    if (Object.hasOwn(valid, 'error')) {
        const message = valid.error.details.reduce((str, item) => str + item.message + "\n", "");
        return res.status(400).send(message);
    }

    DB.addJogo(jogo).then((id) => {
        return res.status(201).json({ id }); 
    }).catch((err) => {
        console.log(err);
        return res.status(500).send('Erro ao inserir jogo');
    });
})
.put('/jogos/:ID', async (req, res) => {
    const { ID } = req.params;
    const { body } = req;

    if (!ID) return res.status(400).send('É necessário fornecer o ID');

    const jogo = await DB.getJogoByID(parseInt(ID));
    if (!jogo) return res.status(404).send('Jogo não encontrado');
    if (!body) return res.status(400).send('Request body expected');

    const { titulo, desenvolvedora, plataforma, ano_lancamento, genero, duracao_media_horas, avaliacao } = body;
    const newJogo = new Jogo(titulo, desenvolvedora, plataforma, ano_lancamento, genero, duracao_media_horas, avaliacao);
    const valid = newJogo.validate();

    if (Object.hasOwn(valid, 'error')) {
        const message = valid.error.details.reduce((str, item) => str + item.message + "\n", "");
        return res.status(400).send(message);
    }

    await DB.deleteJogo(parseInt(ID));

    DB.insertJogo(parseInt(ID), newJogo)
        .then(j => res.status(200).json(j))
        .catch(err => {
            console.log(err);
            res.status(500).send('Erro ao alterar o jogo ' + ID);
        });
})
.delete('/jogos/:ID', async (req, res) => {
    const { ID } = req.params;
    if (!ID) return res.status(400).send('É necessário fornecer o ID');

    const jogo = await DB.getJogoByID(parseInt(ID));
    if (!jogo) return res.status(404).send('Jogo não encontrado');

    DB.deleteJogo(parseInt(ID)).then(() => res.status(200).send('Jogo removido'));
});


app.listen(3000, (err) => {
    if (err) console.log(err);
    console.log('Servidor escutando na porta 3000');
});
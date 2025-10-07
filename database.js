const { readFile, writeFile } = require('node:fs/promises');

const livrosFile = './data_livros.json';
const jogosFile = './data_jogos.json';
const usersFile = './users.json';
const encodingOption = { encoding: 'utf-8' };


const getDataLivros = () => {
    return readFile(livrosFile, encodingOption).then(x => JSON.parse(x));
};
const setDataLivros = (data) => {
    return writeFile(livrosFile, JSON.stringify(data), encodingOption);
};


const getDataJogos = () => {
    return readFile(jogosFile, encodingOption).then(x => JSON.parse(x));
};
const setDataJogos = (data) => {
    return writeFile(jogosFile, JSON.stringify(data), encodingOption);
};


const getUsers = () => {
    return readFile(usersFile, encodingOption).then(x => JSON.parse(x));
};


const getLivros = () => {
    return getDataLivros().then(x => x.livros);
};
const deleteLivro = async (ID) => {
    const data = await getDataLivros();
    data.livros = data.livros.filter(l => l.id != ID);
    return setDataLivros(data);
};
const getLivroByID = (ID) => {
    return getLivros().then(ls => ls.find(l => l.id === ID));
};
const addLivro = async (livro) => {
    const data = await getDataLivros();
    const { nextId, livros } = data;
    livro.id = nextId;
    const newData = {
        nextId: nextId + 1,
        livros: [...livros, livro]
    };
    await setDataLivros(newData);
    return livro.id;
};
const insertLivro = async (id, livro) => {
    const data = await getDataLivros();
    const { nextId, livros } = data;
    livro.id = id;
    const newData = {
        nextId,
        livros: [...livros, livro]
    };
    await setDataLivros(newData);
    return livro;
};


const getJogos = () => {
    return getDataJogos().then(x => x.jogos);
};
const deleteJogo = async (ID) => {
    const data = await getDataJogos();
    data.jogos = data.jogos.filter(j => j.id != ID);
    return setDataJogos(data);
};
const getJogoByID = (ID) => {
    return getJogos().then(js => js.find(j => j.id === ID));
};
const addJogo = async (jogo) => {
    const data = await getDataJogos();
    const { nextId, jogos } = data;
    jogo.id = nextId;
    const newData = {
        nextId: nextId + 1,
        jogos: [...jogos, jogo]
    };
    await setDataJogos(newData);
    return jogo.id;
};
const insertJogo = async (id, jogo) => {
    const data = await getDataJogos();
    const { nextId, jogos } = data;
    jogo.id = id;
    const newData = {
        nextId,
        jogos: [...jogos, jogo]
    };
    await setDataJogos(newData);
    return jogo;
};


const getUserByApiKey = async (api_key) => {
    return getUsers().then(us => us.find(u => u.api_key === api_key));
};

module.exports = {
    getLivros,
    deleteLivro,
    addLivro,
    insertLivro,
    getLivroByID,
    getJogos,
    deleteJogo,
    addJogo,
    insertJogo,
    getJogoByID,
    getUserByApiKey
};
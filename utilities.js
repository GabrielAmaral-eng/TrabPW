// A função de ordenação foi apenas adaptada para usar 'avaliacao', que é o campo nos seus dados.
const orderByAvaliacaoDesc = (a, b) => b.avaliacao - a.avaliacao;

// Esta função para Livros é uma cópia da original, alterando 'musics' para 'livros'.
const createSimplifiedOrderedLivroList = (livrosPromise, orderFunction) => {
    return livrosPromise
        .then(ls => ls.map(l => {
            // Trocamos {id, titulo, artista, popularidade} por {id, titulo, autor, avaliacao}
            const { id, titulo, autor, avaliacao } = l;
            const tratado = {
                id,
                descritivo: `${titulo} (${autor})`, // Ex: "1984 (George Orwell)"
                avaliacao
            };
            return tratado;
        }))
        .then(ls => ls.sort(orderFunction));
};

// Esta função para Jogos também é uma cópia, alterando para o contexto de jogos.
const createSimplifiedOrderedJogoList = (jogosPromise, orderFunction) => {
    return jogosPromise
        .then(js => js.map(j => {
            // Trocamos para {id, titulo, desenvolvedora, avaliacao}
            const { id, titulo, desenvolvedora, avaliacao } = j;
            const tratado = {
                id,
                descritivo: `${titulo} (${desenvolvedora})`, // Ex: "The Legend of Zelda (Nintendo)"
                avaliacao
            };
            return tratado;
        }))
        .then(js => js.sort(orderFunction));
};

module.exports = {
    orderByAvaliacaoDesc,
    createSimplifiedOrderedLivroList,
    createSimplifiedOrderedJogoList
};
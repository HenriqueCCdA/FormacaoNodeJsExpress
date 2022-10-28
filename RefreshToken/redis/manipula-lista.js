const { promisify } = require("util");


module.exports = lista => {

    const setAsync = promisify(lista.set).bind(lista);
    const existsAsync = promisify(lista.exists).bind(lista);
    const getAsync = promisify(lista.get).bind(lista);
    const delAsync = promisify(lista.del).bind(lista)

    return {
        async adiciona(chave, valor, dataExipracao) {
            await setAsync(chave, valor);
            lista.expireat(chave, dataExipracao);
        },

        async buscaValor(chave){
            return getAsync(chave);
        },

        async contemChave(chave) {
            const resultado = await existsAsync(chave);
            return resultado === 1;
        },

        async delete(chave) {
            await delAsync(chave);
        }
    };
}
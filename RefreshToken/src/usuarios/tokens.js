const jwt = require('jsonwebtoken');
const allowlistResfrestToken = require('../../redis/allowlist-refresh-token');
const blocklistAccessToken = require('../../redis/blocklist-access-token');
const {InvalidArgumentError} = require('../erros');

const crypto = require('crypto');
const moment = require('moment');

function criaTokenJWT(id, [tempoQuantidade, tempoUnidade]) {
  const payload = { id,};

  const token = jwt.sign(payload, process.env.CHAVE_JWT, { expiresIn: tempoQuantidade + tempoUnidade });
  return token;
}


async function verificaTokenJWT(token, nome, blocklist) {
  await verificaTokenNaBlocklist(token, nome, blocklist);
  const {id} = jwt.verify(token, process.env.CHAVE_JWT);
  return id;
}

async function verificaTokenNaBlocklist(token, nome, blocklist) {

  if(!blocklist){
    return;
  }

  const tokenNaBlocklist = await blocklist.contemToken(token);
  if (tokenNaBlocklist) {
    throw new jwt.JsonWebTokenError(`${nome} inválido por logout!`);
  }
}

async function criaTokenOpaco(id, [tempoQuantidade, tempoUnidade], allowlist){
  const tokenOpaco = crypto.randomBytes(24).toString('hex');
  const dataExipração = moment().add(tempoQuantidade, tempoUnidade).unix();
  await allowlist.adiciona(tokenOpaco, id, dataExipração);
  return tokenOpaco;
}


async function verificaTokenOpaco(token, nome, allowlist) {

  verificaTokenEnviado(token, nome);
  const id = await allowlist.buscaValor(token);
  verificaTokenValido(id, nome);

  return id;

}

function verificaTokenValido(id, nome) {
  if (!id) {
    throw new InvalidArgumentError(`${nome} não enviado!`);
  }
}

function verificaTokenEnviado(token, nome) {
  if (!token) {
    throw new InvalidArgumentError(`${nome} não enviado!`);
  }
}

function invalidaTokenJWT(token, blocklist) {
  return blocklist.adiciona(token);
}


async function invalidaTokenOpaco(token, allowlist) {
  await allowlist.delete(token);
};


module.exports = {

  access: {
    nome: 'access token',
    lista: blocklistAccessToken,
    expiracao: [15, 'm'],
    cria(id){
      return criaTokenJWT(id, this.expiracao);
    },
    verifica(token) {
      return verificaTokenJWT(token, this.nome, this.lista);
    },
    invalida(token){
      return invalidaTokenJWT(token, this.lista);
    }
  },
  refresh: {
    nome: 'refesh token',
    lista: allowlistResfrestToken,
    expiracao: [5, 'd'],
    cria(id){
      return criaTokenOpaco(id, this.expiracao, this.lista);
    },
    verifica(token) {
      return verificaTokenOpaco(token, this.nome, this.lista);
    },
    invalida(token){
      return invalidaTokenOpaco(token, this.lista);
    }
  },
  verificacaoEmail: {
    nome: 'token de verificação de e-mail',
    expiracao: [1, 'h'],
    cria(id){
      return criaTokenJWT(id, this.expiracao);
    },
    verifica(token){
      return verificaTokenJWT(token, this.nome);
    }

  }
};

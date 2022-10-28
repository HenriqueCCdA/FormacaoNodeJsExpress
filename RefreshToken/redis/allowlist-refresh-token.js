const redis = require('redis');
const manipulaLista = require('./manipula-lista');
const allowlist = redis.createClient({prefix: 'allowlist-refrest-token:'});

module.exports = manipulaLista(allowlist);
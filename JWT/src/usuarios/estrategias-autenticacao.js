const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError } = require('../erros');

const bycypt = require('bcrypt');



function verificaUsuario(usuario) {
    if (!usuario) {
        throw new InvalidArgumentError('Não existe usuaŕio com esse e-mail');
    }
}

async function verificaSenha(senha, senhaHash) {
    const senhaValida = await bycypt.compare(senha, senhaHash);
    if (!senhaValida){
        throw new InvalidArgumentError('E-mail ou senha inválidos');
    }
}


passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'senha',
        session: false
    }, async (email, senha, done) => {
        try {
            const usuario = await Usuario.buscaPorEmail(email);
            verificaUsuario(usuario);
            await verificaSenha(senha, usuario.senhaHash);
            done(null, usuario);
        } catch (erro){
            done(erro);
        }
    })
)
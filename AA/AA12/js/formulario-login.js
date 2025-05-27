

function lidarComBotaoDeLogin(){
    mostrarApenasHome()
}

function lidarComFormularioDeLogin(){
    const botaoDeEntrar = document.getElementById('botaoLogin');
    botaoDeEntrar.disabled = true

    const entradeDeEmail = document.getElementById('login-email');
    const entradeDeSenha = document.getElementById('login-password');


    const email = entradeDeEmail.value
    const senha = entradeDeSenha.value

    const emailEhValido = validarEmail(email)

    if(!emailEhValido || senha === '') return
    
    botaoDeEntrar.disabled = false
}

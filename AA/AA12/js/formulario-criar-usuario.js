class Conta {
    constructor(nome, sobrenome, cpf, email, senha, cep, logradouro, bairro, cidade, estado){
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
        this.cep = cep;
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.cidade = cidade;
        this.estado = estado;
    }
}


function lidarComBotaoDeCriarConta(){
    const entradeDeNome = document.getElementById('nome');
    const entradeDeSobrenome = document.getElementById('sobrenome');
    const entradeDeCPF = document.getElementById('cpf');
    const entradeDeEmail = document.getElementById('email');
    const entradeDeSenha = document.getElementById('senha');
    const entradaCEP = document.getElementById('cep');
    const entradaLogradouro = document.getElementById('logradouro');
    const entradaBairro = document.getElementById('bairro');
    const entradaCidade = document.getElementById('cidade');
    const entradaEstado = document.getElementById('estado');


    const nome = entradeDeNome.value;
    const sobrenome = entradeDeSobrenome.value;
    const cpf = entradeDeCPF.value;
    const email = entradeDeEmail.value;
    const senha = entradeDeSenha.value;
    const cep = entradaCEP.value;
    const logradouro = entradaLogradouro.value;
    const bairro = entradaBairro.value;
    const cidade = entradaCidade.value;
    const estado = entradaEstado.value;

    try {
        const objetoCpf = new CPF(cpf);
        const conta = new Conta(nome, sobrenome, objetoCpf, email, senha, cep, logradouro, bairro, cidade, estado);
        console.log(conta);
    } catch(error) {
        console.error(error);
    }

    mostrarApenasLogin();
}

async function buscarEnderecoPorCEP(cep) {
    const statusDoCEP = document.getElementById('statusCep');
    const entradaLogradouro = document.getElementById('logradouro');
    const entradaBairro = document.getElementById('bairro');
    const entradaCidade = document.getElementById('cidade');
    const entradaEstado = document.getElementById('estado');
    const iconeDeValidado = document.createElement('img');
    iconeDeValidado.src = 'https://cdn2.iconfinder.com/data/icons/basic-flat-icon-set/128/tick-64.png';
    iconeDeValidado.width = 12;
    iconeDeValidado.height = 12;

    entradaLogradouro.value = '';
    entradaBairro.value = '';
    entradaCidade.value = '';
    entradaEstado.value = '';
    statusDoCEP.textContent = '';

    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
        statusDoCEP.textContent = 'CEP inválido. Deve conter 8 números.';
        return false;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        if (!response.ok) {
            throw new Error('Não foi possível buscar o CEP.');
        }
        const data = await response.json();

        if (data.erro) {
            statusDoCEP.textContent = 'CEP não encontrado.';
            return false;
        }

        entradaLogradouro.value = data.logradouro || '';
        entradaBairro.value = data.bairro || '';
        entradaCidade.value = data.localidade || '';
        entradaEstado.value = data.uf || '';

        statusDoCEP.replaceChildren(iconeDeValidado.cloneNode());
        lidarComFormularioDeCriarUsuario();
        return true;

    } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        statusDoCEP.textContent = 'Erro ao buscar CEP. Tente novamente.';
        return false;
    }
}


function lidarComFormularioDeCriarUsuario(){
    const botaoDeCriarConta = document.getElementById('botaoCriarConta');
    botaoDeCriarConta.disabled = true;

    const entradeDeNome = document.getElementById('nome');
    const statusDoNome = document.getElementById('statusNome');

    const entradeDeSobrenome = document.getElementById('sobrenome');
    const statusDoSobrenome =  document.getElementById('statusSobrenome');

    const entradeDeCPF = document.getElementById('cpf');
    const statusDoCPF =  document.getElementById('statusCPF');

    const entradeDeEmail = document.getElementById('email');
    const statusDoEmail =  document.getElementById('statusEmail');

    const entradeDeSenha = document.getElementById('senha');
    const statusDaSenha =  document.getElementById('statusSenha');

    const entradeDeConfirmacao = document.getElementById('confirmacao');
    const statusDaConfirmacao =  document.getElementById('statusRepitaSenha');

    const entradaCEP = document.getElementById('cep');
    const statusDoCEP = document.getElementById('statusCep');
    const entradaLogradouro = document.getElementById('logradouro');
    const statusLogradouro = document.getElementById('statusLogradouro');
    const entradaBairro = document.getElementById('bairro');
    const statusBairro = document.getElementById('statusBairro');
    const entradaCidade = document.getElementById('cidade');
    const statusCidade = document.getElementById('statusCidade');
    const entradaEstado = document.getElementById('estado');
    const statusEstado = document.getElementById('statusEstado');


    const iconeDeValidado = document.createElement('img');
    iconeDeValidado.src = 'https://cdn2.iconfinder.com/data/icons/basic-flat-icon-set/128/tick-64.png';
    iconeDeValidado.width = 12;
    iconeDeValidado.height = 12;

    const nome = entradeDeNome.value;
    const sobrenome = entradeDeSobrenome.value;
    const cpf = entradeDeCPF.value;
    const email = entradeDeEmail.value;
    const senha = entradeDeSenha.value;
    const confirmacao = entradeDeConfirmacao.value;
    const cep = entradaCEP.value;
    const logradouro = entradaLogradouro.value;
    const bairro = entradaBairro.value;
    const cidade = entradaCidade.value;
    const estado = entradaEstado.value;

    let nomeValido = false;
    let sobrenomeValido = false;
    let cpfValido = false;
    let emailValido = false;
    let senhaValida = false;
    let confirmacaoValida = false;
    let cepValido = statusDoCEP.innerHTML.includes('tick-64.png');
    let logradouroValido = false;
    let bairroValido = false;
    let cidadeValida = false;
    let estadoValido = false;

    if (nome === '') {
        statusDoNome.textContent = 'Digite um nome';
    } else {
        statusDoNome.replaceChildren(iconeDeValidado.cloneNode());
        nomeValido = true;
    }

    if (sobrenome === '') {
        statusDoSobrenome.textContent = 'Digite um sobrenome';
    } else {
        statusDoSobrenome.replaceChildren(iconeDeValidado.cloneNode());
        sobrenomeValido = true;
    }

    try{
        new CPF(cpf);
        statusDoCPF.replaceChildren(iconeDeValidado.cloneNode());
        cpfValido = true;
    } catch (error){
        statusDoCPF.textContent = error instanceof Error ? error.message : 'Digite um CPF válido';
        cpfValido = false;
    }

    if (!validarEmail(email)) {
        statusDoEmail.textContent = 'Digite um email válido';
    } else {
        statusDoEmail.replaceChildren(iconeDeValidado.cloneNode());
        emailValido = true;
    }

    if (senha === '') {
        statusDaSenha.textContent = 'Digite uma senha válida';
    } else {
        statusDaSenha.replaceChildren(iconeDeValidado.cloneNode());
        senhaValida = true;
    }

    if (senha !== confirmacao || confirmacao === '') {
        statusDaConfirmacao.textContent = 'As senhas não conferem ou campo vazio';
    } else {
        statusDaConfirmacao.replaceChildren(iconeDeValidado.cloneNode());
        confirmacaoValida = true;
    }

    if (cep === '') {
        statusDoCEP.textContent = 'Digite um CEP';
        cepValido = false;
    }

    if (logradouro === '') {
        statusLogradouro.textContent = 'Logradouro é obrigatório';
    } else {
        statusLogradouro.replaceChildren(iconeDeValidado.cloneNode());
        logradouroValido = true;
    }

    if (bairro === '') {
        statusBairro.textContent = 'Bairro é obrigatório';
    } else {
        statusBairro.replaceChildren(iconeDeValidado.cloneNode());
        bairroValido = true;
    }

    if (cidade === '') {
        statusCidade.textContent = 'Cidade é obrigatória';
    } else {
        statusCidade.replaceChildren(iconeDeValidado.cloneNode());
        cidadeValida = true;
    }

    if (estado === '') {
        statusEstado.textContent = 'Estado é obrigatório';
    } else {
        statusEstado.replaceChildren(iconeDeValidado.cloneNode());
        estadoValido = true;
    }

    if(nomeValido && sobrenomeValido && cpfValido && emailValido && senhaValida && confirmacaoValida && cepValido && logradouroValido && bairroValido && cidadeValida && estadoValido) {
        botaoDeCriarConta.disabled = false;
    } else {
        botaoDeCriarConta.disabled = true;
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const entradaCEP = document.getElementById('cep');
    if(entradaCEP) {
        entradaCEP.addEventListener('blur', (e) => {
            buscarEnderecoPorCEP(e.target.value);
        });
    }

});

async function carregarUFs() {
    const selectUF = document.getElementById('selecionarUF');
    const selectMunicipio = document.getElementById('selecionarMunicipio');

    selectMunicipio.innerHTML = '<option value="">Selecione um Município</option>';
    selectMunicipio.disabled = true;
    selectUF.innerHTML = '<option value="">Carregando UFs...</option>';

    try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const ufs = await response.json();

        selectUF.innerHTML = '<option value="">Selecione um Estado</option>';

        ufs.forEach(uf => {
            const option = document.createElement('option');
            option.value = uf.sigla;
            option.textContent = uf.nome;
            selectUF.appendChild(option);
        });

    } catch (error) {
        console.error('Falha ao carregar UFs:', error);
        selectUF.innerHTML = '<option value="">Erro ao carregar UFs</option>';
        selectMunicipio.innerHTML = '<option value="">Selecione um Município</option>';
        selectMunicipio.disabled = true;
    }
}

async function carregarMunicipios(ufSigla) {
    const selectMunicipio = document.getElementById('selecionarMunicipio');

    selectMunicipio.innerHTML = '<option value="">Carregando municípios...</option>';
    selectMunicipio.disabled = true;

    if (!ufSigla) {
        selectMunicipio.innerHTML = '<option value="">Selecione um Município</option>';
        return;
    }

    try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSigla}/municipios?orderBy=nome`);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const municipios = await response.json();

        selectMunicipio.innerHTML = '<option value="">Selecione um Município</option>';

        if (municipios.length === 0) {
             selectMunicipio.innerHTML = '<option value="">Nenhum município encontrado</option>';
        } else {
            municipios.forEach(municipio => {
                const option = document.createElement('option');
                option.value = municipio.nome;
                option.textContent = municipio.nome;
                selectMunicipio.appendChild(option);
            });
            selectMunicipio.disabled = false;
        }

    } catch (error) {
        console.error('Falha ao carregar municípios:', error);
        selectMunicipio.innerHTML = '<option value="">Erro ao carregar municípios</option>';
        selectMunicipio.disabled = true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const entradaCEP = document.getElementById('cep');
    if(entradaCEP) {
        entradaCEP.addEventListener('blur', (e) => {
            buscarEnderecoPorCEP(e.target.value);
        });
    }

    const selectUFElement = document.getElementById('selecionarUF');

    if (selectUFElement) {
        carregarUFs();

        selectUFElement.addEventListener('change', (event) => {
            const ufSelecionada = event.target.value;
            carregarMunicipios(ufSelecionada);
        });
    }
});
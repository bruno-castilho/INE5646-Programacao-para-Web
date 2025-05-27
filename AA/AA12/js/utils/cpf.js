class CPF{
    constructor(cpf){
        if (!this.haOnzeDigitos(cpf)) 
            throw new Error('O CPF não tem 11 dígitos');
        
        if (!this.todosOsOnzeDigitosSaoNumeros(cpf)) 
            throw new Error('Os 11 dígitos devem ser números');
        
        if (!this.osOnzeNumerosSaoDiferentes(cpf)) 
            throw new Error('Os 11 dígitos devem ser diferentes');
        
        if (!this.oPrimeiroDigitoVerificadorEhValido(cpf)) 
            throw new Error('O primeiro dígito verificador não é válido');
        
        if (!this.oSegundoDigitoVerificadorEhValido(cpf)) 
            throw new Error('O segundo dígito verificador não é válido');

        this.valor = cpf
        
    }

    haOnzeDigitos(cpf) {
        return cpf.length === 11;
    }
    
    
    todosOsOnzeDigitosSaoNumeros(cpf) {
        
        return /^\d{11}$/.test(cpf);
    }
    
    osOnzeNumerosSaoDiferentes(cpf) {
        return new Set(cpf.split('')).size > 1;
    
    }
    
    oPrimeiroDigitoVerificadorEhValido(cpf) {
        const numeros = cpf.replace(/\D/g, '');
        const primeiroDigitoVerificador = parseInt(numeros[numeros.length - 2],10)
        
        
        let soma = 0;
        let peso = 10;
        
        for (let i = 0; i < 9; i++) {
            soma += parseInt(numeros[i], 10) * peso;
            peso--;
        }
    
    
        let resto = soma % 11
    
        if (resto < 2) return primeiroDigitoVerificador === 0 
    
        return primeiroDigitoVerificador === 11 - resto
    }
    
    oSegundoDigitoVerificadorEhValido(cpf) {
        const numeros = cpf.replace(/\D/g, '');
        const segundoDigitoVerificador = parseInt(numeros[numeros.length - 1],10)
        
        
        let soma = 0;
        let peso = 11;
        
        for (let i = 0; i < 10; i++) {
            soma += parseInt(numeros[i], 10) * peso;
            peso--;
        }
    
    
        let resto = soma % 11
    
        if (resto < 2) return segundoDigitoVerificador === 0 
    
        return segundoDigitoVerificador === 11 - resto
    }
}





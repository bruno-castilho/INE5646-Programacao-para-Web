function verificaAltura(altura) {
    return new Promise((resolve, reject) => {
        console.log('verificando o tamanho')
        setTimeout(() => {
            if (altura > 0) {
                resolve('o triangulo existe')
            } else {
                reject('triangulo nao existe')
            }
        },3000)
    })
}

let altura = 0
let topo = '$'

let promessa = verificaAltura(Number(altura));

promessa
    .then(msg => {
        console.log('criando o triangulo');
        console.log(msg);
        console.log(' ')

        if (altura === 1){
            console.log(topo);
        } else {
            console.log(topo);

            for (let i = 2; i < altura; i++) {
                let linha = '$';

                for (let j = 2; j < i; j++) {
                    linha += ' '
                }
                linha += '$'
                console.log(linha)
            }
            let base = ''
            for (let b = 0; b < altura; b++) {
                base += '$'
            }
            console.log(base)
        
        }
        
    })
    .catch(msg => {
        console.log(msg)
    })


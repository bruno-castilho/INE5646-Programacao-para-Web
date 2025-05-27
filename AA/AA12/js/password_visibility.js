function mostrarSenha() {
    const senhaInput = document.getElementById('login-password');
    const olhoImg = document.getElementById('olho');
    if (senhaInput && olhoImg) {
        senhaInput.type = 'text';
        olhoImg.src = 'https://cdn3.iconfinder.com/data/icons/feather-5/24/eye-off-512.png';
    }
}

function ocultarSenha() {
    const senhaInput = document.getElementById('login-password');
    const olhoImg = document.getElementById('olho');
    if (senhaInput && olhoImg) {
        senhaInput.type = 'password';
        olhoImg.src = 'https://cdn0.iconfinder.com/data/icons/ui-icons-pack/100/ui-icon-pack-14-512.png';
    }
}

function lidarComSaidaDoInputDeSenha(){
    const olhoImg = document.getElementById('olho');
    ocultarSenha()
    olhoImg.classList.remove('visivel');
}


function lidarComCliqueNoOlho(){
    const olhoImg = document.getElementById('olho');

    const estaVisivel = olhoImg.classList.contains('visivel')

    if(!estaVisivel){
        mostrarSenha()
        olhoImg.classList.add('visivel');
        return
    }

    
    
    ocultarSenha()
    olhoImg.classList.remove('visivel');
}

document.addEventListener('DOMContentLoaded', function() {
    const senhaInput = document.getElementById('login-password');
    if (senhaInput) {
        senhaInput.addEventListener('blur', ocultarSenha);
    }
});
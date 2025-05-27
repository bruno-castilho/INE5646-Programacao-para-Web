function mostrarApenasHome() {
    const divHome = document.getElementById('divHome');
    const loginBody = document.getElementById('login-body');
    const novaConta = document.getElementById('nova-conta');
    
    if (divHome) divHome.style.display = 'block';
    if (loginBody) loginBody.style.display = 'none';
    if (novaConta) novaConta.style.display = 'none';
}

function mostrarApenasLogin() {
    const divHome = document.getElementById('divHome');
    const loginBody = document.getElementById('login-body');
    const novaConta = document.getElementById('nova-conta');
    
    if (divHome) divHome.style.display = 'none';
    if (loginBody) loginBody.style.display = 'block';
    if (novaConta) novaConta.style.display = 'none';
    
    // Resetar campos
    const form = document.querySelector('#login-body form');
    if (form) form.reset();

}

function mostrarApenasConta() {
    const divHome = document.getElementById('divHome');
    const loginBody = document.getElementById('login-body');
    const novaConta = document.getElementById('nova-conta');
    
    if (divHome) divHome.style.display = 'none';
    if (loginBody) loginBody.style.display = 'none';
    if (novaConta) novaConta.style.display = 'block';
    
    // Resetar campos
    const form = document.querySelector('#nova-conta form');
    if (form) {
        form.reset();
        document.querySelectorAll('#nova-conta p').forEach(p => {
            p.textContent = '';
            p.className = '';
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    mostrarApenasHome();
});
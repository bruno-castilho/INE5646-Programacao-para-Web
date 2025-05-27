function validarEmail(email) {
    let count = 0;
    for (const char of email) {
        if (char === '@') count++;
        
        if (count === 2) break
    }

    temUmArroba = count === 1 ? true : false
    return temUmArroba
}
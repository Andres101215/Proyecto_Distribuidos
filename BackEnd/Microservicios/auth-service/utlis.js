function generarToken() {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
    
    const letra1 = letras[Math.floor(Math.random() * letras.length)];
    const letra2 = letras[Math.floor(Math.random() * letras.length)];
    const numero1 = numeros[Math.floor(Math.random() * numeros.length)];
    const numero2 = numeros[Math.floor(Math.random() * numeros.length)];
  
    return `${letra1}${letra2}${numero1}${numero2}`;
  }
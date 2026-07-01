
const contenedorInventario = document.getElementById('contenedor-inventario');

function cargarInventario() {
    
    let inventario = JSON.parse(localStorage.getItem('miInventarioCSGO')) || [];

 
    contenedorInventario.innerHTML = '';

    
    if (inventario.length === 0) {
        contenedorInventario.innerHTML = '<p style="color: #888; grid-column: 1 / -1; text-align: center; font-size: 18px; margin-top: 50px;">Tu inventario está vacío. ¡Andá al catálogo a sumar armas!</p>';
        return;
    }

    
    inventario.forEach(item => {
        const tipoArma = item.name.split(' | ')[0];
        const tarjeta = document.createElement('div');
        
        
        tarjeta.className = 'tarjeta-skin'; 

        tarjeta.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${tipoArma === "Sticker" ? "Pegatina" : tipoArma}</p>
            <button class="btn-quitar">Quitar del inventario</button>
        `;

        
        const boton = tarjeta.querySelector('.btn-quitar');
        boton.addEventListener('click', () => quitarDelInventario(item.id));

        contenedorInventario.appendChild(tarjeta);
    });
}

function quitarDelInventario(idItem) {
    let inventario = JSON.parse(localStorage.getItem('miInventarioCSGO')) || [];
    
    
    inventario = inventario.filter(item => item.id !== idItem);
    
   
    localStorage.setItem('miInventarioCSGO', JSON.stringify(inventario));
    
    
    cargarInventario();
}


cargarInventario();
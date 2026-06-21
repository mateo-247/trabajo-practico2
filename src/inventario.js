// Capturamos el div vacío del HTML
const contenedorInventario = document.getElementById('contenedor-inventario');

function cargarInventario() {
    // 1. Traemos lo guardado en el carrito (o un arreglo vacío si no hay nada)
    let inventario = JSON.parse(localStorage.getItem('miInventarioCSGO')) || [];

    // 2. Limpiamos la pantalla
    contenedorInventario.innerHTML = '';

    // 3. Si no hay armas, mostramos un mensaje facha
    if (inventario.length === 0) {
        contenedorInventario.innerHTML = '<p style="color: #888; grid-column: 1 / -1; text-align: center; font-size: 18px; margin-top: 50px;">Tu inventario está vacío. ¡Andá al catálogo a sumar armas!</p>';
        return;
    }

    // 4. Recorremos cada arma guardada y le armamos su tarjeta
    inventario.forEach(item => {
        const tipoArma = item.name.split(' | ')[0];
        const tarjeta = document.createElement('div');
        
        // ¡CLAVE! Le ponemos la clase de CSS que usa el catálogo
        tarjeta.className = 'tarjeta-skin'; 

        tarjeta.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${tipoArma === "Sticker" ? "Pegatina" : tipoArma}</p>
            <button class="btn-quitar">Quitar del inventario</button>
        `;

        // 5. Le damos vida al botón para que borre el arma
        const boton = tarjeta.querySelector('.btn-quitar');
        boton.addEventListener('click', () => quitarDelInventario(item.id));

        contenedorInventario.appendChild(tarjeta);
    });
}

function quitarDelInventario(idItem) {
    let inventario = JSON.parse(localStorage.getItem('miInventarioCSGO')) || [];
    
    // Filtramos dejando pasar a todas MENOS a la que queremos borrar
    inventario = inventario.filter(item => item.id !== idItem);
    
    // Sobrescribimos el LocalStorage con la nueva lista recortada
    localStorage.setItem('miInventarioCSGO', JSON.stringify(inventario));
    
    // Volvemos a dibujar las tarjetas (la borrada ya no va a aparecer)
    cargarInventario();
}

// Ejecutamos la función de una para que cargue la pantalla
cargarInventario();
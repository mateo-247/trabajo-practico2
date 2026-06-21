const contenedorInventario = document.getElementById('contenedor-inventario');

function cargarInventario() {
    const inventario = JSON.parse(localStorage.getItem('miInventarioCSGO')) || [];
    contenedorInventario.innerHTML = '';

    if (inventario.length === 0) {
        contenedorInventario.innerHTML = '<p style="color: #888; grid-column: 1 / -1; text-align: center;">Tu inventario está vacío. ¡Andá al catálogo a agregar algunas skins!</p>';
        return;
    }

    inventario.forEach(skin => {
        const tipoArma = skin.name.split(' | ')[0];
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-skin';

        tarjeta.innerHTML = `
            <img src="${skin.image}" alt="${skin.name}">
            <h3>${skin.name}</h3>
            <p>${tipoArma}</p>
            <button class="btn-agregar" style="border-color: #ff4c4c; color: #ff4c4c;">Quitar del inventario</button>
        `;

        const botonQuitar = tarjeta.querySelector('button');
        botonQuitar.addEventListener('click', () => eliminarDelInventario(skin.id));

        contenedorInventario.appendChild(tarjeta);
    });
}

function eliminarDelInventario(idSkin) {
    let inventario = JSON.parse(localStorage.getItem('miInventarioCSGO')) || [];
    inventario = inventario.filter(skin => skin.id !== idSkin);
    localStorage.setItem('miInventarioCSGO', JSON.stringify(inventario));
    cargarInventario();
}

cargarInventario();
let todasLasSkins = [];

const contenedorSkins = document.getElementById('contenedor-skins');
const buscador = document.getElementById('buscador');
const filtroArma = document.getElementById('filtro-arma');
const selectorOrdenar = document.getElementById('ordenar');

async function obtenerDatosAPI() {
    try {
        contenedorSkins.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #de9b35;">Cargando arsenal y stickers desde la base de datos...</p>';

        // 1. Traemos las skins de las armas
        const resSkins = await fetch('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json');        
        if (!resSkins.ok) throw new Error('Fallo al cargar armas.');
        const datosSkins = await resSkins.json();
        
        // 2. Traemos los stickers
        const resStickers = await fetch('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/stickers.json');
        if (!resStickers.ok) throw new Error('Fallo al cargar stickers.');
        const datosStickers = await resStickers.json();

        // 3. Filtramos las armas
        const armasQueQueremos = ["AK-47", "M4A4", "M4A1-S", "AWP", "Glock-18", "USP-S", "Desert Eagle", "★"];
        const skinsFiltradas = datosSkins.filter(skin => 
            armasQueQueremos.some(arma => skin.name.startsWith(arma))
        );

        // 4. Filtramos los stickers de 9z
        const stickers9z = datosStickers.filter(sticker => 
            sticker.name.toLowerCase().includes('9z')
        );

        // 5. Unimos todo
        todasLasSkins = [...skinsFiltradas, ...stickers9z];

        generarOpcionesArmas(todasLasSkins);
        mostrarSkins(todasLasSkins);

    } catch (error) {
        console.error("Error en la API:", error);
        contenedorSkins.innerHTML = `<p style="color: #de9b35; grid-column: 1 / -1; text-align: center;">Hubo un error al cargar los datos: ${error.message}</p>`;
    }
}

function mostrarSkins(skins) {
    contenedorSkins.innerHTML = '';

    if (skins.length === 0) {
        contenedorSkins.innerHTML = '<p style="color: #888; grid-column: 1 / -1; text-align: center;">No se encontraron skins con esos filtros.</p>';
        return;
    }

    skins.forEach(skin => {
        const tipoArma = skin.name.split(' | ')[0];
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-skin';

        tarjeta.innerHTML = `
            <img src="${skin.image}" alt="${skin.name}">
            <h3>${skin.name}</h3>
            <p>${tipoArma}</p>
            <button class="btn-agregar" data-id="${skin.id}">Agregar al inventario</button>
        `;

        const boton = tarjeta.querySelector('.btn-agregar');
        boton.addEventListener('click', () => guardarEnInventario(skin));

        contenedorSkins.appendChild(tarjeta);
    });
}

function generarOpcionesArmas(skins) {
    const armasUnicas = new Set();
    
    skins.forEach(skin => {
        const tipoArma = skin.name.split(' | ')[0];
        armasUnicas.add(tipoArma);
    });

    const armasOrdenadas = Array.from(armasUnicas).sort();
    
    armasOrdenadas.forEach(arma => {
        const opcion = document.createElement('option');
        opcion.value = arma;
        opcion.textContent = arma;
        filtroArma.appendChild(opcion);
    });
}

function aplicarFiltros() {
    let skinsFiltradas = todasLasSkins;

    const textoBuscado = buscador.value.toLowerCase();
    if (textoBuscado !== '') {
        skinsFiltradas = skinsFiltradas.filter(skin => 
            skin.name.toLowerCase().includes(textoBuscado)
        );
    }

    const armaSeleccionada = filtroArma.value;
    if (armaSeleccionada !== 'todas') {
        skinsFiltradas = skinsFiltradas.filter(skin => 
            skin.name.startsWith(armaSeleccionada)
        );
    }

    const tipoOrden = selectorOrdenar.value;
    if (tipoOrden === 'az') {
        skinsFiltradas.sort((a, b) => a.name.localeCompare(b.name));
    } else if (tipoOrden === 'za') {
        skinsFiltradas.sort((a, b) => b.name.localeCompare(a.name));
    }

    mostrarSkins(skinsFiltradas);
}

function guardarEnInventario(item) {
    let inventario = JSON.parse(localStorage.getItem('miInventarioCSGO')) || [];
    const yaExiste = inventario.some(elemento => elemento.id === item.id);

    if (yaExiste) {
        alert('¡Ya tenés este ítem en tu inventario!');
    } else {
        inventario.push(item);
        localStorage.setItem('miInventarioCSGO', JSON.stringify(inventario));
        alert(`¡${item.name} se agregó con éxito a tu inventario!`);
    }
}

buscador.addEventListener('input', aplicarFiltros);
filtroArma.addEventListener('change', aplicarFiltros);
selectorOrdenar.addEventListener('change', aplicarFiltros);

// Arrancamos todo
obtenerDatosAPI();

// --- LÓGICA DEL MODAL DE INSPECCIÓN ---
const modal = document.getElementById('modal-inspeccionar');
const imgModal = document.getElementById('imagen-modal');
const btnCerrar = document.querySelector('.cerrar-modal');

document.addEventListener('click', (evento) => {
    if (evento.target.matches('.tarjeta-skin img')) {
        imgModal.src = evento.target.src;
        modal.classList.remove('modal-oculto');
        modal.classList.add('modal-visible');
    }
});

if(btnCerrar) {
    btnCerrar.addEventListener('click', () => {
        modal.classList.remove('modal-visible');
        modal.classList.add('modal-oculto');
    });
}

window.addEventListener('click', (evento) => {
    if (evento.target === modal) {
        modal.classList.remove('modal-visible');
        modal.classList.add('modal-oculto');
    }
});
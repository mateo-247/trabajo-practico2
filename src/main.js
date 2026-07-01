let todasLasSkins = [];
let paginaActual = 1;
const itemsPorPagina = 15; 

const contenedorSkins = document.getElementById('contenedor-skins');
const buscador = document.getElementById('buscador');
const filtroArma = document.getElementById('filtro-arma');
const selectorOrdenar = document.getElementById('ordenar');
const contenedorPaginacion = document.getElementById('contenedor-paginacion');

async function obtenerDatosAPI() {
    try {
        contenedorSkins.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #de9b35;">Cargando arsenal y stickers desde la base de datos...</p>';

        const resSkins = await fetch('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json');        
        if (!resSkins.ok) throw new Error('Fallo al cargar armas.');
        const datosSkins = await resSkins.json();
        
        const resStickers = await fetch('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/stickers.json');
        if (!resStickers.ok) throw new Error('Fallo al cargar stickers.');
        const datosStickers = await resStickers.json();

        const armasQueQueremos = ["AK-47", "M4A4", "M4A1-S", "AWP", "Glock-18", "USP-S", "Desert Eagle", "★"];
        const skinsFiltradas = datosSkins.filter(skin => 
            armasQueQueremos.some(arma => skin.name.startsWith(arma))
        );

        const stickers9z = datosStickers.filter(sticker => 
            sticker.name.toLowerCase().includes('9z')
        );

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

   
    contenedorSkins.classList.remove('animacion-fade'); 
    void contenedorSkins.offsetWidth; 
    contenedorSkins.classList.add('animacion-fade'); 
    

    if (skins.length === 0) {
        contenedorSkins.innerHTML = '<p style="color: #888; grid-column: 1 / -1; text-align: center;">No se encontraron skins con esos filtros.</p>';
        contenedorPaginacion.innerHTML = '';
        return;
    }

    const totalItems = skins.length;
    const totalPaginas = Math.ceil(totalItems / itemsPorPagina);

    if (paginaActual > totalPaginas) {
        paginaActual = 1;
    }

    const inicio = (paginaActual - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    const skinsVisibles = skins.slice(inicio, fin);

    skinsVisibles.forEach(skin => {
        const tipoArma = skin.name.split(' | ')[0];
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-skin';

        tarjeta.innerHTML = `
            <img src="${skin.image}" alt="${skin.name}">
            <h3>${skin.name}</h3>
            <p>${tipoArma === "Sticker" ? "Pegatina" : tipoArma}</p>
            <button class="btn-agregar" data-id="${skin.id}">Agregar al inventario</button>
        `;

        const boton = tarjeta.querySelector('.btn-agregar');
        boton.addEventListener('click', () => guardarEnInventario(skin));

        contenedorSkins.appendChild(tarjeta);
    });

    renderizarBotonesPaginacion(totalPaginas, skins);
}

function renderizarBotonesPaginacion(totalPaginas, skinsCompletas) {
    contenedorPaginacion.innerHTML = '';

    if (totalPaginas <= 1) return;

    const maxBotones = 5;
    let paginaInicio = Math.max(1, paginaActual - 2);
    let paginaFin = Math.min(totalPaginas, paginaInicio + maxBotones - 1);

    if (paginaFin - paginaInicio + 1 < maxBotones) {
        paginaInicio = Math.max(1, paginaFin - maxBotones + 1);
    }

   
    if (paginaActual > 1) {
        const btnAnterior = document.createElement('button');
        btnAnterior.textContent = '« Ant';
        establecerEstilosBotonPaginacion(btnAnterior, false);
        btnAnterior.addEventListener('click', () => {
            paginaActual--;
            mostrarSkins(skinsCompletas);
            contenedorSkins.scrollIntoView({ behavior: 'smooth' });
        });
        contenedorPaginacion.appendChild(btnAnterior);
    }

    
    for (let i = paginaInicio; i <= paginaFin; i++) {
        const boton = document.createElement('button');
        boton.textContent = i;
        establecerEstilosBotonPaginacion(boton, i === paginaActual);

        boton.addEventListener('click', () => {
            paginaActual = i;
            mostrarSkins(skinsCompletas);
            contenedorSkins.scrollIntoView({ behavior: 'smooth' });
        });

        contenedorPaginacion.appendChild(boton);
    }

    
    if (paginaActual < totalPaginas) {
        const btnSiguiente = document.createElement('button');
        btnSiguiente.textContent = 'Sig »';
        establecerEstilosBotonPaginacion(btnSiguiente, false);
        btnSiguiente.addEventListener('click', () => {
            paginaActual++;
            mostrarSkins(skinsCompletas);
            contenedorSkins.scrollIntoView({ behavior: 'smooth' });
        });
        contenedorPaginacion.appendChild(btnSiguiente);
    }
}

function establecerEstilosBotonPaginacion(boton, esActivo) {
    boton.style.margin = '0 5px';
    boton.style.padding = '8px 12px';
    boton.style.cursor = 'pointer';
    boton.style.fontWeight = 'bold';
    boton.style.borderRadius = '4px';
    boton.style.border = '1px solid #444';
    
    if (esActivo) {
        boton.style.backgroundColor = '#de9b35';
        boton.style.color = '#000';
    } else {
        boton.style.backgroundColor = '#1e1e1e';
        boton.style.color = '#fff';
    }
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
    paginaActual = 1; 
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

obtenerDatosAPI();


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
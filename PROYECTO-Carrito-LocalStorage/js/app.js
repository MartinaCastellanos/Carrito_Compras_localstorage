// VARIABLES

const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const listaCursos = document.querySelector('#lista-cursos');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
let articulosCarrito = [];

cargarEventListeners();

function cargarEventListeners() {
    // cuando agregas un curso presionando 'agregar al carrito'
    listaCursos.addEventListener('click', agregarCurso);

    // elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    // muestra los cursos del local storage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();

    })

    // vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; // reseteamos el arreglo

        limpiarHTML(); // eliminamos todo el html
    })
};

// FUNCIONES
function agregarCurso(e) {

    // prevenimos que cuando toquemos el btn agregar carrito no se vaya para arriba
    // porque tiene un href con # , en otro caso ahi tendria que ir un link,
    // como no hay nada lo sube, entonces lo prevenimos
    e.preventDefault();

    // para que solo demos click en agregar carrito y no en todo el card
    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement
        leerDatosCursos(cursoSeleccionado);
    };
};

// eliminar un curso del carrito
function eliminarCurso(e) {
    // para que solo demos click en eliminar del carrito, que solo se de click en la x
    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');

        // elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId)

        carritoHTML(); // iterar sobre el carrito y mostrar su html
    };
}

// lee el contenido del html al que le dimos click y extrar la info del curso
function leerDatosCursos(curso) {

    //crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    };
    // revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id)
    if (existe) {
        // actualizamos la cantidad
        const cursos = articulosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso; // retorna el objeto actualizado
            } else {
                return curso; // retorna los objetos que no son duplicados
            };
        })
        articulosCarrito = [...cursos];
    } else {
        // agregamos el curso al carrito
        // agrega los elemtnos al arreglo del carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    };

    carritoHTML();

};

// muestra el carrito de compras en el html
function carritoHTML() {

    // limpiar el html
    limpiarHTML();

    // recorre el carrito y genera el html
    articulosCarrito.forEach(curso => {

        // creamos destructuring para eliminar repeticiones de variables
        const { imagen, titulo, precio, cantidad, id } = curso

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100">
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> X </a>
            </td>
        `;

        // agrega el html del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });

    // agregar el carrito de compras al storage
    sincronizarStorage();
};

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// elimina los cursos del tbody
function limpiarHTML() {

    //forma lenta
    // contenedorCarrito.innerHTML = '';

    // mejor performance
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    };
};
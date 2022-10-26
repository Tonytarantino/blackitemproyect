const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
/* const btnCarrito = document.getElementById('') */
let carrito = {}


/* eventos */
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito')) /* meto la info en la const carrito */
        pintarCarrito()
    }
})
AOS.init();
/* btnCarrito.addEventListener('click', e => {
cards.innerHTML = ''
}) */

cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e) /* acciones de sumar o restar items */
})


const fetchData = async () => {
    try {
        const res = await fetch('base.json')
        const data = await res.json() /* guarda datos de la base que trajo del json */
        //console.log(data)
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }

}

const pintarCards = data => {
    data.forEach(producto => {
        //console.log(producto) /* muestra los productos */
        templateCard.querySelector('h5').textContent = producto.title //acomodar clases para titulos
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
        templateCard.querySelector('.btnComprar').dataset.id = producto.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    //console.log(e.target)
    //console.log(e.target.classList.contains('btnComprar')) /* chequeo que al objeto que le haga clic tenga ese class */
    if (e.target.classList.contains('btnComprar')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()/* detiene herencias de eventos */
}

const setCarrito = objeto => {
    /* console.log(objeto); */ //chequeo que tome el objeto entero, la card
    const producto = {
        id: objeto.querySelector('.btnComprar').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) { /* consulta si se repite en la propiedad id */
        producto.cantidad = carrito[producto.id].cantidad + 1 /* si se repite el id, le suma uno a la cant */
    }
    carrito[producto.id] = { ...producto } /* se adquiere las info de l54 y se hace una copia de "producto" */
    /* console.log(producto); */
    pintarCarrito()
}

const pintarCarrito = () => {
    /*  console.log(carrito); */
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id /* acomodar la clase */
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title/* como no tiene clases se accede al primero, pero le tengo que poner clase para que sea más comodo */
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btnMas').dataset.id = producto.id
        templateCarrito.querySelector('.btnMenos').dataset.id = producto.id
        templateCarrito.querySelector('.prodPrecio').textContent = producto.cantidad * producto.precio /* calculo para que dé el total si se repite en el carrito */

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment) /* porque contiene el clon del carrito */

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito)) /* recupero a coleccion de objetos */
}

const pintarFooter = () => { /* para cuando se carga el carrito se reescriba el footer avisando que hay productos */
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
    <th scope="row" colspan="5">Carrito vacío. ¡Sumá tu black item!</th>
    `
        return /* para que salga de acá y no pinte lo siguiente cuando el carro esta vacio  */
    }

    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0) /* recorre objetos, unicamente cantidad y acumula su valor, devolviendo un número (puede devolver objeto tambien) */
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)  /* multiplica cantidad por precio y lo mete en el acumulador */
    //console.log(nPrecio );
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad/* mejorar la clase */
    templateFooter.querySelector('span').textContent = nPrecio/* mejorar la clase */

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {} /* vuelve a vaciar el carro como al principio */
        pintarCarrito() /* lo muestra vacio */
    })
}

const btnAccion = e => {
    //console.log(e.target); chequeo a qué boton se le está haciendo click
    if (e.target.classList.contains('btnMas')) {
        /* carrito[e.target.dataset.id]  */
        const producto = carrito[e.target.dataset.id]
        /* producto.cantidad = carrito[e.target.dataset.id].cantidad + 1  */
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto } /* copia */
        pintarCarrito()
    }
    if (e.target.classList.contains('btnMenos')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
}
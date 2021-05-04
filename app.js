const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
    //.content es para acceder a los elementos
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
    //fragment, memoria volatil
const fragment = document.createDocumentFragment()
let carrito = {}; //collection de objectos

//espera a que el html este cargado y parseado y luego ejecuta el js
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})
cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
})

const fetchData = async() => {
    try {
        const res = await fetch('api.json')
            //guardamos - collection
            //esperar que la respuesta venga en json 
        const data = await res.json()
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}

const pintarCards = data => {

    //recorrer
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)

    });
    //con esto evitamos el reflow  
    cards.appendChild(fragment)
}

const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        //setCarrito      
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}
const setCarrito = objecto => {
        // console.log(objecto)
        const producto = {
            id: objecto.querySelector('.btn-dark').dataset.id,
            title: objecto.querySelector('h5').textContent,
            precio: objecto.querySelector('p').textContent,
            cantidad: 1
        }
        if (carrito.hasOwnProperty(producto.id)) {
            producto.cantidad = carrito[producto.id].cantidad + 1
        }
        //creando el index - con su producto id - si no existe, lo vamos a crear, pero si existe, se debe sobreescribir
        carrito[producto.id] = {...producto } //copia de producto
        pintarCarrito()
    }
    //pintamos el carrito en el DOM

const pintarCarrito = () => {

    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    pintarFooter()
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)

    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const btnVaciar = document.querySelector('#vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}

const btnAccion = e => {
    //accion de + -
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad = carrito[e.target.dataset.id].cantidad + 1
        carrito[e.target.dataset.id] = {...producto }
        pintarCarrito()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
            if (producto.cantidad === 0) {
                delete carrito[e.target.dataset.id]
            } else {
                carrito[e.target.dataset.id] = {...producto }
            }
        pintarCarrito()
    }

    e.stopPropagation()

}
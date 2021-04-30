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

const fetchData = async() => {
    try {
        const res = await fetch('api.json')
            //guardamos la data - collection
            //esperar que la respuesta venga en json 
        const data = await res.json()

        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}

const pintarCards = data => {
    console.log(data)
        //recorrer la data
    data.forEach(producto => {
        console.log(producto)
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
    // console.log(e.target)
    //console.log(e.target.classList.contains('btn-dark'))
    if (e.target.classList.contains('btn-dark')) {
        //setCarrito

        //console.log(e.target.parentElement)
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
                //cantidad++
        }
        //creando el index - con su producto id - si no existe, lo vamos a crear, pero si existe, se debe sobreescribir
        carrito[producto.id] = {...producto } //copia de producto
        pintarCarrito()
    }
    //pintamos el carrito en el DOM

const pintarCarrito = () => {
    //console.log(carrito)
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
}
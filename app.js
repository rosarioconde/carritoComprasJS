const items = document.getElementById('items')
    //.content es para acceder a los elementos
const templateCard = document.getElementById('template-card').content
    //fragment, memoria volatil
const fragment = document.createDocumentFragment()

//espera a que el html este cargado y parseado y luego ejecuta el js
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
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
    items.appendChild(fragment)
}
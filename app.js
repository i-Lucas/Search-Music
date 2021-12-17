// API para buscar as letras das músicas
const apiURL = `https://api.lyrics.ovh`

// obtendo as referências do DOM
const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsConteiner = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

// verificando se obtemos as referências do DOM
console.log({ form, searchInput, songsConteiner, prevAndNextContainer })

const getMoreSongs = async url => {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
    // fetch retorna uma promisse com objeto response
    
    const data = await response.json()
    //console.log(data)

    insertSongsInToPage(data)
}

const insertSongsInToPage = songsInfo => {

    songsConteiner.innerHTML = songsInfo.data.map(song => `
    <li class ="song" >
    <span class ="song-artist"><strong>${song.artist.name}</strong> - ${song.title}</span>
    <button class ="btn" data-artist ="${song.artist.name}" data-song-title=${song.title}">Ver Letra</button>
    </li>
    
    `).join('')

    if (songsInfo.prev || songsInfo.next) {
        prevAndNextContainer.innerHTML = `
        ${songsInfo.prev ? `<button class="btn" onClick="getMoreSongs('${songsInfo.prev}')">Anteriores</button>` : ''}
        ${songsInfo.next ? `<button class="btn" onClick="getMoreSongs('${songsInfo.next}')">Próximas</button>` : ''}
    `
        return
    }

    prevAndNextContainer.innerHTML = ''

}

const fetchSongs = async term => {

    const response = await fetch(`${apiURL}/suggest/${term}`)
    // fetch retorna uma promisse com objeto response

    const data = await response.json()
    //console.log(data)

    insertSongsInToPage(data)
}

// função que executa quando o formulário for enviado
form.addEventListener('submit', event => {

    // evitando que o formulário seja enviado diretamente
    event.preventDefault()

    // obtendo o input e
    const searchTerm = searchInput.value
        .trim() // removendo os espaços em branco da string

    // verificando se a string input está vazia
    if (!searchTerm) {
        // inserindo uma Li no HTML
        songsConteiner.innerHTML =
            `<li class="warning-message">Por favor digite um termo válido</li>`
        return
    }

    // fazer requisição do artista e música 
    fetchSongs(searchTerm)
    console.log(searchTerm)
})

const fetchLyrics = async (artist, songTitle) => {
    const response = await fetch(`${apiURL}/v1/${artist}/${songTitle}`)
    const data = await response.json()
    // link OFF :/
    console.log(data)
}

songsConteiner.addEventListener('click', event => {
    const clickedElement = event.target

    if (clickedElement.tagName === 'BUTTON') {
        const artist = clickedElement.getAttribute('data-artist')
        const songTitle = clickedElement.getAttribute('data-song-title')

        fetchLyrics(artist, songTitle)
    }
})
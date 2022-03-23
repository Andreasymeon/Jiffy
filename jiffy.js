// store key
const API_KEY = 'b8F1FLKnEMqneK7Z4B321SOgIRczQcl6'

// grabs elements
// - search input
// - search hint
// - videos
// - search clear
const searchEl = document.querySelector('.search-input')
const hintEl = document.querySelector('.search-hint')
const videoEl = document.querySelector('.videos')
const clearEl = document.querySelector('.search-clear')


// gets random gif from array
const randomChoice = (arr) => {
  const randIndex = Math.floor(Math.random() * arr.length)

  return arr[randIndex]
}


// creates video
const createVideo = src => {
  const video = document.createElement('video')
  video.src = src
  video.autoplay = true
  video.loop = true

  video.className = 'video'

  return video
}

// toggle page state between loading and not loading
const toggleLoading = (state) => {

  if (state) {
    document.body.classList.add('loading')
    searchEl.disabled = true
  } else {
    document.body.classList.remove('loading')
    searchEl.disabled = false
    searchEl.focus()
  }
}


// grabs gifs from gipphy API
const searchGiphy = (searchTerm) => {
  toggleLoading(true)

  fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=50&offset=0&rating=pg-13&lang=en`
  )
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      const gif = randomChoice(json.data)
      const src = gif.images.original.mp4

      // use createVideo function by giving src attribute and it gives back the video
      const video = createVideo(src)

      videoEl.appendChild(video)

      // transistion effect
      video.addEventListener('loadeddata', (event) => {
        video.classList.add('visible')

        toggleLoading(false)

        document.body.classList.add('has-results')

        hintEl.innerHTML = `Hit enter to search more ${searchTerm}`
      })
    })
    .catch((error) => {
      toggleLoading(false)
      hintEl.innerHTML = `Nothing found for ${searchTerm}`
    })
}

const doSearch = (event) => {
  const searchTerm = searchEl.value
  if (searchTerm.length > 2) {
    hintEl.innerHTML = `Hit enter to search ${searchTerm}`
    document.body.classList.add('show-hint')
  } else {
    document.body.classList.remove('show-hint')
  }

  if (event.key === 'Enter' && searchTerm.length > 2) {
    searchGiphy(searchTerm)
  }
}

// clear out content when clicking on clear cross
const clearSearch = (event) => {
  document.body.classList.remove('has-results')
  videoEl.innerHTML = ''
  hintEl.innerHTML = ''
  searchEl.value = ''
  // focus cursor back onto input
  searchEl.focus()
}


document.addEventListener('keyup', event => {
  if (event.key === 'Escape'){
    clearSearch()
  }
})

searchEl.addEventListener('keyup', doSearch)
clearEl.addEventListener('click', clearSearch)

const movieResult = document.getElementById('movieResult');
const listGrp = document.getElementById('list-grp');
const image = document.getElementById('image');

const title = document.getElementById('title');
const year = document.getElementById('year');
const genre = document.getElementById('genre');
const lang = document.getElementById('lang');
const actor = document.getElementById('actor');
const plot = document.getElementById('plot');
const rating = document.getElementById('rating');
const director = document.getElementById('director');
const writer = document.getElementById('writer');

const details = document.getElementById('details');

const fav = document.getElementById('fav');
getLocalArray()
document.getElementById('input').addEventListener('input', (event) =>{
    if((event.target.value).length == 0){
        movieResult.textContent = ''
    }
    getMovieList(event.target.value,(event.target.value).length)
})

function getMovieList(name,length){
    try {
        const res = fetch(`http://www.omdbapi.com/?t=${name}&apikey=bcf4abeb`).then(async resp =>{
            return await resp.json();
        });
        res.then(async mov => {
            if(length === 0){
                movieResult.textContent = "";
                fav.style.visibility = 'hidden';
                return;
            }
            showMovie(mov)
        });
    } catch (error) {
        
    }
}

const movieFav = [];
movi = {};
function showMovie(item){
    if(item.hasOwnProperty('Title')){
        movi = item;
        movieResult.textContent = `${item.Title} (${item.Year})`
        fav.style.visibility = 'visible';
        if(!fav.hasEventListener){
            fav.hasEventListener = true;
            fav.addEventListener('click', () =>{
                onClickFavorite();
            })
        }
    }else{
        movieResult.textContent = "Movie not found!"
        fav.style.visibility = 'hidden';
    }  
}

movieResult.addEventListener('click', () =>{
    console.log(movi);
    details.style.visibility = 'visible';
    image.setAttribute('src' , movi.Poster);
    title.textContent = movi.Title;
    year.textContent = movi.Year;
    genre.textContent = movi.Genre;
    lang.textContent = movi.Language;
    actor.textContent = movi.Actors;
    plot.textContent = movi.Plot;
    rating.textContent = movi.imdbRating;
    director.textContent = movi.Director;
    writer.textContent = movi.Writer;
})

function onClickFavorite(){
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    movies.unshift(movi);
    localStorage.setItem('movies', JSON.stringify(movies));
    getLocalArray();
    movi = {};
}

function getLocalArray(){
    const movies = JSON.parse(localStorage.getItem('movies')) || [];    
    console.log(movies);
    listGrp.innerHTML = ""
    movies.forEach(el =>{
        const item = `<li class="list-group-item" id="${el.imdbID}">${el.Title} (${el.Year}) <img src="./Assets/delete.png" alt="" class="${el.imdbID}" id="delete"></li>`;
        listGrp.innerHTML += item
    })
    reloadPage()
}

let deletedEl = ""
let selectEl = ""
reloadPage();
function reloadPage(){
    const dItem = document.querySelectorAll('#delete')
    dItem.forEach(el =>{
        el.addEventListener('click', () =>{
            deletedEl = el.className;
            deleteMovieFromFav()
        })
    })

    const selectMovieFromFav = document.querySelectorAll('.list-group-item')
    selectMovieFromFav.forEach(el =>{
        // console.log(el.id);
        el.addEventListener('click', () =>{
            selectEl = el.id
            showMovieDetails()
        })
    })
}

function showMovieDetails(){
    console.log('hi');
    const moviesList = JSON.parse(localStorage.getItem('movies')) || [];
    const moviee = moviesList.filter(el => el.imdbID == selectEl);
    console.log(moviee[0]);
    let movi = moviee[0]
    details.style.visibility = 'visible';
    image.setAttribute('src' , movi.Poster);
    title.textContent = movi.Title;
    year.textContent = movi.Year;
    genre.textContent = movi.Genre;
    lang.textContent = movi.Language;
    actor.textContent = movi.Actors;
    plot.textContent = movi.Plot;
    rating.textContent = movi.imdbRating;
    director.textContent = movi.Director;
    writer.textContent = movi.Writer;
   
}

function deleteMovieFromFav(){
    const moviesList = JSON.parse(localStorage.getItem('movies')) || [];
    const index = moviesList.findIndex(el => el.imdbID == deletedEl);
    if (index !== -1) {
        moviesList.splice(index, 1);
        localStorage.setItem('movies', JSON.stringify(moviesList));
        getLocalArray();
        location.reload()
    }
    // getLocalArray();
}




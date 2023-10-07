const express = require('express');

const hbs = require('hbs');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');

const app = express();
const punkAPI = new PunkAPIWrapper();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Register the location for handlebars partials here:

hbs.registerPartials(path.join(__dirname, "views/partials"))

// Add the route handlers here:

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/beers', async (req, res) => {
  try {
    let beers = await punkAPI.getBeers()
    let beersData = beers.map((beers)=>{
      return {
        beerName: beers.name,
        beerImage: beers.image_url,
        beerDescription: beers.description,
        beerTagline: beers.tagline,
        beerID: beers.id
      }
    })
    res.render('beers', {beersData});
  } catch (error) {
    console.log("something went wrong: ", error)
  }
});

app.get('/random-beer', async (req, res) => {
  try {
    let getBeer = await punkAPI.getRandom()
    let randomBeerData = getBeer[0];

    let beer = {
      beerName: randomBeerData.name,
      beerImage: randomBeerData.image_url,
      beerDescription: randomBeerData.description,
      beerTagline: randomBeerData.tagline,
      beerFoodPairing: randomBeerData.food_pairing,
      beerBrewersTips: randomBeerData.brewers_tips
    };
    res.render('random-beers', {beer});
  } catch (error) {
    console.log("something went wrong: ", error)
  }
});

app.get('/beer/:beerID', async (req, res) => {
  try {
    let beers = await punkAPI.getBeers()
    let reqID = parseInt(req.params.beerID)
    let theBeer = checkForBeer(beers, reqID)
    let beer = {
      beerName: theBeer.name,
      beerImage: theBeer.image_url,
      beerDescription: theBeer.description,
      beerTagline: theBeer.tagline,
      beerFoodPairing: theBeer.food_pairing,
      beerBrewersTips: theBeer.brewers_tips
    };
    res.render('beer', {beer});
  } catch (error) {
    console.log("something went wrong: ", error)
  }
});

app.listen(3000, () => console.log('🏃‍ on port 3000'));



// check for beer req URL Match

function checkForBeer(beers, reqID){
  for (let i = 0; i < beers.length; i++) {
    if(beers[i].id === reqID){
      return beers[i]
      break;
    }
  }
}
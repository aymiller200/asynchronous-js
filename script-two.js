/* 
! Promises and the Fetch API

  ? What is a promise? 

    * Fetch functions immediately return a promise.
    * Promise: An object that is used as a placeholder for the future result of an asynchronous operation. It is like a container for an asynchronously delivered value (like a response from an AJAX call).
    * By using promises we no longer need to rely on events and callbacks passed into asynchronous functions to handle asynchronous results. 
    * Instead of nesting callbacks, we can chain promises for a sequence of asynchronous operations: escaping callback hell
    * Promises are an ES6 feature (became available in 2015)
  
  ? Promise Lifecycle: 
    * Pending: Before the future value is available
    * Settled: Asynchronous task has finished.
        ? Two different types of settled promises: 
            * Fulfilled: Successfully resulted in a value
            * Rejected: An error has happened during the asynchronous task
    * We are able to handle these different states in our code.
    * A promise is only settled once, so from there the state will remain unched forever.

? Build promise: 
    * Fetch API returns a promise

? Consume a promise: 
    * We consume a promise when we already have a promise. E.g. promis returned from fetch API


!Event Loop:

? JS Runtime: 
    * JS runtime is a container that includes all the different pieces that are necessary to execute JS code.
    * Heart of every JS runtime is the JS engine -> This is where our code is actually executed, and where objects are stored in memory. These two things happen in the call stack and the heap.
    * JS has one thread of execution, it can only do one thing at a time (single-threaded).
    * Next, we have the web apis environment. These are some APIs provided to the the engine, but are not a part of JavaScript itself (DOM, timers, fetch API, etc).
    * Next is the callback queu (an ordered list of all the callback functions that are in line to be executed). This is a data structure that holds all the ready to be executed callback functions that are attached to some event that has occured. 
    * Whenever the call stack is empty, the event loop takes callbacks from the callback queue and puts them in the call stack so that they can be executed. 
    * The event loop is a crucial piece that makes asynchronous bwhavior possible in JS. It is the reason we can have a non-blocking concurreny model in JS
        ? A concurrency model is simply how a language handles multiple things happening at the same time. 

? How does non-blocking concurrency actually work? 
    * Note: It is in the web APIs environment of the browser where the asynchronous tasks related to the DOM will run, the same is true for timers, ajax calls and really all other asynchronous tasks. This is because if these asynchronous tasks happened in the call stack, it would be blocking the rest of the code from running until this task has finished loading, and therefore create a huge lag in our application.

    * The Event Loop looks into the call stack and determines whether it's empty or not, except for the global context. If the stack is empty (meaning there is no code being executed) then it will take the first callback from the callback queue and put it on the call stack to be executed (this is called an event loop tick). 
    * The event loop has the extremely important task of doing coordination between the call stack and the callbacks in the callback queue. The event loop does the orchestration of the entire js runtime. 
    * JS has no sense of time. This is because everything that happens asynchronously does not happen in the engine. It's the runtime that manages all the asynchronous behavior and it's the event loop that decides which code will be executed next. But the engine itself simply executes whatever code it is given
    
  ?Call backs related to promises, do not got into the callback queue.
      * Call backs of promises have a special queue for themselve --> microtasks queue. 
  ? Microtasks queue: 
      * Has priority over the call back queue
      * At the end of an event loop tick (after a callback has been taken from the callbak queue). The even loop will check if there are any call back in the microtasks queue, and if there are it will run all of them before it will run any more callbacks from the regular callback queue



*/

'use strict'

const btn = document.querySelector('.btn-country')
const countriesContainer = document.querySelector('.countries')

/*
? Old way with ajax

  * const request = new XMLHttpRequest()
  * request.open('GET', `https://restcountries.com/v3.1/name/${country}`) 
  * request.send() 
  
*/

//?Then method: available on all promises.
//? Need to pass in a callback function that we want to be executed as soon as the promise is actually fulfilled (as soon as the result is available)
//? json() method is available on all the response objects that are coming from the fetch function (all of the resolved values). It is also an asynchronous function, that will also return a new promise.
//? Whatever we return in a promise will become the fulfilled value of that promise.
//? finally() method, called always (whereas then is only called with a successful promise, and catch is called with a rejected promise). Not always useful. We use this method for someting that always needs to happen, no matter the result of the promise. For example: Hiding a loading spinner

const renderCountry = function (data, className) {
  const currency = Object.values(data.currencies)
  const language = Object.values(data.languages)

  const html = `
<article class="country ${className}">
        <img class="country__img" src="${data.flags.png}" />
        <div class="country__data">
          <h3 class="country__name">${data.name.common}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>👫</span>${(
            +data.population / 1000000
          ).toFixed(1)}</p>
          <p class="country__row"><span>🗣️</span>${language[0]}</p>
          <p class="country__row"><span>💰</span>${currency[0].name}</p>
        </div>
      </article>
`

  countriesContainer.insertAdjacentHTML('beforeend', html)
}

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg)
  //countriesContainer.style.opacity = 1
}

// const getCountryData = function (country) {
//   //Country 1

//   getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
//     .then((data) => {
//       renderCountry(data[0])
//       const neighbor = data[0].borders[0]

//       if (!neighbor) throw new Error('No neighbor found!')

//       //Country 2
//       return getJSON(
//         `https://restcountries.com/v3.1/alpha/${neighbor}`,
//         'Country not found.',
//       )
//     })
//     .then((data) => {
//       const [data2] = data
//       renderCountry(data2, 'neighbor')
//     })
//     .catch((err) => {
//       console.error(`${err}`)
//       renderError(`Something went wrong: ${err.message}. Try again!`)
//     })
//     .finally(() => {
//       //fade in container
//       countriesContainer.style.opacity = 1
//     })
// }

//! Promisfying the geolocation API

// const getPosition = function () {
//   return new Promise(function (resolve, reject) {
//     // navigator.geolocation.getCurrentPosition(
//     //   (position) => resolve(position),
//     //   (err) => reject(err)
//     // )
//     navigator.geolocation.getCurrentPosition(resolve, reject)
//     //Resolve itself is the callback function whichwill be called with the position. same for reject
//   })
// }

// getPosition().then((pos) => console.log(pos))

//!Challenge 1

//Test data:
// Coordinates 1: 52.508, 13.381 (Latitude, Longitude)
// Coordinates 2: 19.037, 72.873
// Coordinates 3: -33.933, 18.474

// const whereAmI = function () {
//   getPosition()
//     .then((pos) => {
//       const { latitude: lat, longitude: lng } = pos.coords

//       return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
//     })
//     .then((response) => {
//       console.log(response)
//       if (!response.ok) {
//         throw new Error(`Something went wrong (${response.status}), try again!`)
//       }
//       return response.json()
//     })
//     .then((data) => {
//       const { state, country } = data
//       console.log(`You are in ${state}, ${country}`)
//       return fetch(`https://restcountries.com/v3.1/name/${country}`)
//     })
//     .then((res) => {
//       if (!res.ok) throw new Error(`Country not found(${res.status})`)
//       return res.json()
//     })
//     .then((data) => {
//       const [data2] = data
//       renderCountry(data2)
//     })

//     .catch((err) => console.error(err.message))
//     .finally(() => {
//       //fade in container
//       countriesContainer.style.opacity = 1
//     })
// }

//btn.addEventListener('click', whereAmI)

/* 
! Consuming promises with async/await
    * When an async function (a function with the async keyword in fornt of it) is done running in the background, it will automatically return a promise
    * Inside of an async function, we can have one or more 'await' statements. We can use the await keyword to await the result of a fetch promise. Await will stop the code execution at this point of the functino until the promise is fulfilled (until the data has been fetched)
    * Async/Await is simply syntactic sugar over the 'then' method in promises. We are still using promises, just a different way of consuming them.
    * Alot easier to chain promises, because we don't have to return anything, we don't have to use then methods
    * With async/await, we can't use the catch method because we really can't attach it anywhere, so instead we use try/catch statement for error handling
    * Catch block will have access to whatever error occured in the try block


*/

const getJSON = function (url, errMsg = 'Something went wrong') {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`${errMsg} (${response.status})`)
      //throw immediately terminates the current function
    }
    return response.json()
  })
}

countriesContainer.style.opacity = 1

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

const whereAmI = async function () {
  //Geolocation
  try {
    const pos = await getPosition()
    const { latitude: lat, longitude: lng } = pos.coords

    //reverse GeoCoding
    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    if (!resGeo.ok) throw new Error('Problem getting location data')
    const dataGeo = await resGeo.json()

    //Country Data
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.country}`,
    ) //this whole statement will result in the value of the promise, so we can save that in a variable.
    if (!res.ok) throw new Error('Problem getting country')
    const [data] = await res.json() //previously we would have to return this promise and then chain another then handler, but this is so much easier.
    renderCountry(data)
    return `You are in ${dataGeo.city}`
  } catch (err) {
    renderError(` ${err.message}`)

    //reject promise returned from async function
    throw err
  }
}

//const city = whereAmI()
//console.log(city); //Promise, no data
// whereAmI()
//   .then((city) => console.log(city))
//   .catch((err) => console.log(err.message))
//   .finally(() => console.log('Finished getting location')) //Argument passed into the then method will be the result of the promise(what we returned in whereAmI)

//Same as above, but with async/await
;(async function () {
  try {
    const city = await whereAmI()
    console.log(city)
  } catch (err) {
    console.log(err.message)
  } finally {
    console.log('Finished getting location')
  }
})()

const getThreeCountries = async function (c1, c2, c3) {
  try {
    // const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`)
    // const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`)
    // const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c3}`)

    const data = await Promise.all([
      getJSON(`https://restcountries.com/v3.1/name/${c1}`),
      getJSON(`https://restcountries.com/v3.1/name/${c2}`),
      getJSON(`https://restcountries.com/v3.1/name/${c3}`),
    ]) //all (combinator functions) -> static method on promise constructor, takes in an array of promises and it will return a new promise which will then runn all the promises in the array at the same time. Runs in parallel. Promise.all() short circuits when one promise rejects.
    //Whenever you are in a situation where you need to do multiple asynchronous operations at the same time, and operations that don't depend on one another, then you should always run them in parallel

    //console.log(data1.capital, data2.capital, data3.capital)
    console.log(data.map((d) => d[0].capital))
  } catch (err) {
    console.log(err)
  }
}

getThreeCountries('portugal', 'canada', 'tanzania')

//Other Promise Combinators
//Promise.race
//? Receives an array of promises and also returns a promise. Promise returned by promise.race is settled(ie a value is available) as soon as one of the input promises settles (First settled promise wins the race)
//?Promise short circuits whenenver one of the promises gets settled
;(async function () {
  const res = await Promise.race([
    getJSON(`https://restcountries.com/v3.1/name/italy`),
    getJSON(`https://restcountries.com/v3.1/name/egypt`),
    getJSON(`https://restcountries.com/v3.1/name/mexico`),
  ])
  console.log(res[0]) // Will be different depending on what promise fulfills first
})()

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error('request took too long'))
    }, s * 1000)
  })
}

Promise.race([
  getJSON(`https://restcountries.com/v3.1/name/mexico`),
  timeout(1),
])
  .then((res) => console.log(res[0]))
  .catch((err) => console.log(err))

//Promise.allSettled()
//? Takes in an array of promises and returns an array of all the settled promises no matte if they got rejected or not. Does not short circuit
Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('Reject'),
  Promise.resolve('Success'),
]).then((res) => console.log(res))

//Promise.any() (ES2021)
//? Takes in an array of promises, and returns the first fulfilled promise and ignore rejected promises. The Result will always be a fulfilled promise
Promise.any([
  Promise.resolve('Success'),
  Promise.reject('Reject'),
  Promise.resolve('Success'),
]).then((res) => console.log(res))


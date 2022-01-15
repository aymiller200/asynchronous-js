'use strict'

const btn = document.querySelector('.btn-country')
const countriesContainer = document.querySelector('.countries')

///////////////////////////////////////
//https://restcountries.com/v2/

/* 
!Asynchronous JS, AJAX, APIs

? Synchronous: 
    * Most code is synchronous
    * Synchronous code is executed line by line in the exact order of execution that wew defined in our code.
        ?Thread of execution: Part of execution context that actually executes the code in the computer's CPU
    * Each line of code wwaits for previous line to finish
    * Long running operations block code execution
? Asynchronous: 
    * Asynchronous code is executed after a task that runs in the "background" finishes
    * Asynchronous code is non-blocking
    * Execution doesn't wait for an asynchronous task to finish its work
    * Asynchonous programming is all about coordinating the behavior of our program over a certain period of time.
? Ajax:
    * Asynchronous JavaScript And XML: Allows us to communicate with remote web servers in an asynchronous way. With Ajax calls, we can request data from web servers dynamically
?API: 
    * Application Programming Interface: Piece of Software that can be used by another piece of software, in order to allow applications to talk to each other
    * There are many types of APIs in web development, for example: DOM API, Geolocation API, Own class API, "Online" API
    * "Online" API: Application running on a server that receives requests for data, and sends data back as a response.
    * We can build our own web APIs (requires back-end development, like with node.js) or use 3rd-party APIs
    * Most APIs today use the JSON (JS object converted to a string)format, rather than AJAX

? Cors: Cross origin rescource sharing cannot access 3rd party apis without this.

! How the web works: Requests and responses.

?Request-response model or Client-server architecture:


*                       request
? Client (browser) --------------------> Webserver
?                  <--------------------
*                       response

? https://restcountries.com/v2/ :
    * Https: Protocal
        * Every URL gets an http or https which is for the protocol that will be used on this connection.
    * restcountries.com: Domain name
        * This is not the real address of the server we are trying to access.
        * DNS: Domain Name Server.
              * A special kind of server 
              ? First, the browser makes a request to a DNS and this special server will then simply match the web address of the URL to the server's real IP address.
              * After the real IP address has been sent back to the browser we can finally call it:
                  ? https://104.27.142.889.443
                protocal   IP address     port number(443 HTTPS, 80 HTTP)
                *Port number is really just to identify a specific service that iss running on a server.
              * Once we have the real IP address a TCP socket connection is established between the browser and the server, so they are now connected. 
              * TCP: Transmission Control Protocol
              * IP: Internet protocal
                  ? Together, TCP and IP are communication protocols that efine how data travels across the web. They are the internets fundamental control system
                  ? A communication protocol is simply a system of rules that allows two or more parties to communicate
              ? Second: Now it's finally time to make our request. 
                * The request that we make is an HTTP request (HyperText Transer Protocol, another communication protocol that allows clients and web servers to communicate.)
              ? What a request looks like: 
                * Start Line: HTTP Method + request target + HTTP version
                * HTTP Request Headers: Some information that we sent about the request itself (tons of standard different headers)
                * Request body: Only wwhen sending data to server -> POST
              ? Third: We get a response: 
                * Start line: HTTP Version + status code + status message
                * Response Headers: Info about the response itself (many different possibilities)
                * Body: Present is most responses. Contains the JSON data coming back from the API 
              !For web pages (not APIs)
                ? INdex.html is the first to be loaded
                ? Scanned for assets: JS, CSS, images
                ? Process is repeated for each file.
              !HTTP Methods (most important): 
                ? GET: requesting data
                ? POST: sending data
                ? PUT and PATCH: modifying data
            ?Main difference between HTTP and HTTPS: 
                *HTTPS is encrypted using TLS or SSL
    * /v2 : Resource
  
*/

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
  countriesContainer.style.opacity = 1
}

//XML HTTP request function: Old school way
const getCountryAndNeighbor = function (country) {
  //AJAX Call Country 1
  const request = new XMLHttpRequest()
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`) //type of request, and endpoint
  request.send() //send off request to fetch data . As soon as data arrives callback will be called

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.response)
    console.log(data)

    // Render country 1
    renderCountry(data)

    //Get Neighbor Country
    const [neighbor] = data.borders

    if (!neighbor) return

    //Ajax Call 2
    const request2 = new XMLHttpRequest()
    request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbor}`)
    request2.send()

    request2.addEventListener('load', function () {
      const [data2] = JSON.parse(this.responseText)
      console.log(data2)

      renderCountry(data2, 'neighbor')
    })
  })
}

getCountryAndNeighbor('usa')
// getCountryData('usa')
// getCountryData('germany')

//! Building a simple Promise
//? Promise constructor takes exactly one argument -> The promise executor function (a function that takes in a resolve and reject argument)
//? The executor function will contain the asynchronous behavior that we're trying to handle with the promise (should eventually produce a resolve value)
//? Whatever value we pass into the resolve function is going to be the result of the promise that will be available in the then handler
//? Reject function, we pass in the error message that we later want to be able to access in the catch handler
//? We mostly only ever consume promises.We usually only build promises to wrap old callback based functions into promises. This is a process we call promisifying

const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('Lottery draw is happening')
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('You win!')
    } else {
      reject(new Error('You lost :('))
    }
  }, 2000)
})

//Consume promise
lotteryPromise.then((res) => console.log(res)).catch((err) => console.log(err))

//Promisifying setTimeout
const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000)
  })
}

wait(2)
  .then(() => {
    console.log('I waited for two seconds')
    return wait(1)
  })
  .then(() => console.log('I waited for 1 second')) //will create a promise that will wait for 2 seconds, and after 2 seconds the promise will resolve.

//? Create a fulfilled or rejected promise immediately

Promise.resolve('abc').then((x) => console.log(x)) //resolve() static method on the promise constructor. Pass in resolved value. Willresolve immidiately

Promise.reject(new Error('problem')).catch((x) => console.error(x))



//!Challenge Two
/*
  Create a function 'createImage' which receives 'imgPath' as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path
  */

const imgContainer = document.querySelector('.images')
const img = document.createElement('img')

const display = (style) => {
  img.style.display = style
}

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    img.src = imgPath
    img.addEventListener('load', function () {
      imgContainer.append(img)
      resolve(img)
      console.log('loaded')
    })

    img.addEventListener('error', function () {
      reject(new Error('Image not found'))
    })
  })
}

const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000)
  })
}

createImage('../img/img-1.jpg')
  .then((res) => {
    console.log(res)
    return wait(2)
  })
  .then(() => {
    display('none')
    return wait(2)
  })
  .then(() => {
    display('block')
    createImage('../img/img-2.jpg')
    return wait(2)
  })
  .then(() => {
    display('none')
    return wait(2)
  })
  .then(() => {
    display('block')
    createImage('../img/img-3.jpg')
  })
  .catch((err) => console.error(err))

//!Challenge 3
const loadNPause = async function () {
  try {
    let image = createImage('../img/img-1.jpg')
    console.log('Image 1 loaded')
    await wait(2)
    image.style.display = 'none'

    image = createImage('../img/img-2.jpg')
    console.log('Image 2 loaded')
    await wait(2)
    image.style.display = 'none'
    
  } catch (err) {
    console.log(err)
  }
}

//loadNPause()

const loadAll = async function(imgArr){
  try{
    const imgs = imgArr.map(async img => await createImage(img))
    console.log(imgs);

    const imgsEl = await Promise.all(imgs)

    console.log(imgsEl);
    imgsEl.forEach(img => img.classList.add('parallel'))

  }catch(err){
    console.log(err);
  }
}

loadAll(['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg'])

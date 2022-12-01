function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1 }
  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 7000); // Change image every 2 seconds
}

function injectHTML(list) {
  console.log('fired injectHTML');
  const target = document.querySelector("#rlist");
  target.innerHTML = '';

  const listelmnt = document.createElement("ol");
  target.appendChild(listelmnt);

  list.forEach(i => {
    const element = document.createElement("li");
    element.innerText = i.name;
    listelmnt.appendChild(element);
  });
}
function getRandInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function processRestaurants(list) {
  console.log('fired restaurants list');
  const range = [...Array(15).keys()];
  const arr = range.map((i) => {
    const index = getRandInt(0, list.length);
    return list[index]
  })
  return arr;
  /*
    ## Process Data Separately From Injecting It
      This function should accept your 1,000 records
      then select 15 random records
      and return an object containing only the restaurant's name, category, and geocoded location
      So we can inject them using the HTML injection function
      */
}

function filterlist(array, filterInputvalue) {
  return array.filter((i) => {
    if (!i.name) { return; }
    const lowerCaseName = i.name.toLowerCase();
    const lowerCaseQuery = filterInputvalue.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

async function mainEvent() {
  /*
    ## Main Event
      Separating your main programming from your side functions will help you organize your thoughts
      When you're not working in a heavily-commented "learning" file, this also is more legible
      If you separate your work, when one piece is complete, you can save it and trust it
  */
  // the async keyword means we can make API requests
  const form = document.querySelector('.main_form'); // get your main form so you can do JS with it
  const submit = document.querySelector('#get'); // get a reference to your submit button
  submit.style.display = 'none'; // let your submit button disappear

  /*
    Let's get some data from the API - it will take a second or two to load
    This next line goes to the request for 'GET' in the file at /server/routes/foodServiceRoutes.js
    It's at about line 27 - go have a look and see what we're retrieving and sending back.
   */
  const results = await fetch('/');
  const arrayFromJson = await results.json(); // here is where we get the data from our request as JSON

  /*
    Below this comment, we log out a table of all the results using "dot notation"
    An alternate notation would be "bracket notation" - arrayFromJson["data"]
    Dot notation is preferred in JS unless you have a good reason to use brackets
    The 'data' key, which we set at line 38 in foodServiceRoutes.js, contains all 1,000 records we need
  */
  console.table(arrayFromJson.data);

  // in your browser console, try expanding this object to see what fields are available to work with
  // for example: arrayFromJson.data[0].name, etc
  console.log(arrayFromJson.data[0]);

  // this is called "string interpolation" and is how we build large text blocks with variables
  console.log(`${arrayFromJson.data[0].name} ${arrayFromJson.data[0].category}`);

  // This IF statement ensures we can't do anything if we don't have information yet
  if (arrayFromJson.data?.length > 0) { // the question mark in this means "if this is set at all"
    submit.style.display = 'block'; // let's turn the submit button back on by setting it to display as a block when we have data available
    // And here's an eventListener! It's listening for a "submit" button specifically being clicked
    // this is a synchronous event event, because we already did our async request above, and waited for it to resolve
    let currentlist = [];

    form.addEventListener('input', (event) => {
      console.log(event.target.value)
      const tlist = filterlist(currentlist, event.target.value);
      injectHTML(tlist);
    })

    form.addEventListener('submit', (submitEvent) => {
      // This is needed to stop our page from changing to a new URL even though it heard a GET request
      submitEvent.preventDefault();

      // This constant will have the value of your 15-restaurant collection when it processes
      currentlist = processRestaurants(arrayFromJson.data);
      console.log(currentlist);

      // And this function call will perform the "side effect" of injecting the HTML list for you
      injectHTML(currentlist);

      // By separating the functions, we open the possibility of regenerating the list
      // without having to retrieve fresh data every time
      // We also have access to some form values, so we could filter the list based on name
    });
  }
}

/*
This last line actually runs first!
It's calling the 'mainEvent' function at line 57
It runs first because the listener is set to when your HTML content has loaded
*/
let slideIndex = 0;
showSlides();
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests

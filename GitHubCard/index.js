/* Step 1: using axios, send a GET request to the following URL 
           (replacing the palceholder with your Github name):
           https://api.github.com/users/<your name>
*/

// Implemented using promises ...ok
axios
  .get("https://api.github.com/users/drejohnson")
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log("The data was not returned", error);
  });
// Implemented using async/await ...awesome!!!
(async function() {
  try {
    const response = await axios.get("https://api.github.com/users/drejohnson");
    console.log(response.data);
  } catch (error) {
    console.log("The data was not returned", error);
  }
})();

/* Step 2: Inspect and study the data coming back, this is YOUR 
   github info! You will need to understand the structure of this 
   data in order to use it to build your component function 

   Skip to Step 3.
*/

/* Step 4: Pass the data received from Github into your function, 
           create a new component and add it to the DOM as a child of .cards
*/

/* Step 5: Now that you have your own card getting added to the DOM, either 
          follow this link in your browser https://api.github.com/users/<Your github name>/followers 
          , manually find some other users' github handles, or use the list found 
          at the bottom of the page. Get at least 5 different Github usernames and add them as
          Individual strings to the friendsArray below.
          
          Using that array, iterate over it, requesting data for each user, creating a new card for each
          user, and adding that card to the DOM.
*/

const followersArray = [];

/* Step 3: Create a function that accepts a single object as its only argument,
          Using DOM methods and properties, create a component that will return the following DOM element:

<div class="card">
  <img src={image url of user} />
  <div class="card-info">
    <h3 class="name">{users name}</h3>
    <p class="username">{users user name}</p>
    <p>Location: {users location}</p>
    <p>Profile:  
      <a href={address to users github page}>{address to users github page}</a>
    </p>
    <p>Followers: {users followers count}</p>
    <p>Following: {users following count}</p>
    <p>Bio: {users bio}</p>
  </div>
</div>

*/

/* List of LS Instructors Github username's: 
  tetondan
  dustinmyers
  justsml
  luishrd
  bigknell
*/

const cards = document.querySelector(".cards");

const createElement = () =>
  new Proxy(
    // target object to proxy
    {},
    // Handler object with a trap (get method)
    {
      // trap (get method)
      get(obj, tag) {
        return (props = {}, children = []) => {
          const element = document.createElement(tag);

          const event = key => key.substr(2).toLowerCase();

          Object.entries(props).forEach(([key, value]) => {
            key.startsWith("on") && typeof value === "function"
              ? element.addEventListener(event(key), value)
              : element.setAttribute(key, value);
          });

          if (!Array.isArray(children)) {
            children = [children];
          }

          children.map(child => {
            return typeof child === "string"
              ? (element.textContent = child)
              : element.appendChild(child);
          });
          return element;
        };
      }
    }
  );

const { div, img, h3, p, a } = createElement();

const githubCard = ({
  avatar_url,
  name,
  login,
  location,
  html_url,
  followers,
  following,
  bio
}) =>
  div({ class: "card" }, [
    img({ src: avatar_url }),
    div({ class: "class-info" }, [
      h3({ class: "name" }, name),
      p({ class: "username" }, login),
      p({}, `Location: ${location}`),
      p({}, ["Profile: ", a({ href: html_url }, html_url)]),
      p({}, `Followers: ${followers}`),
      p({}, `Following: ${following}`),
      p({}, `Bio: ${bio}`)
    ])
  ]);

function getProfile(username) {
  const url = `https://api.github.com/users/${username}`;
  return axios
    .get(url, {
      headers: {
        Authorization: `token 7a4c6866f516dc2e838363314c09c372c6cff3e7`
      }
    })
    .then(response => {
      const me = response.data;
      const card = githubCard(me);
      cards.appendChild(card);
      return me;
    })
    .then(user =>
      axios
        .get(user.followers_url, {
          headers: {
            Authorization: `token 7a4c6866f516dc2e838363314c09c372c6cff3e7`
          }
        })
        .then(response => response.data)
        .then(followers =>
          followers.map(follower => getProfile(follower.login))
        )
    )
    .catch(error => {
      console.log("The data was not returned", error);
    });
}

getProfile("drejohnson");

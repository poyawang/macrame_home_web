
window.onload=function(){
    
    var ham = document.querySelector(".ham")
    
    

    ham.addEventListener("click", toggleMenu)

    var menu = document.querySelector(".menu")
  var menuIcon = document.querySelector(".menuIcon")
  var xIcon = document.querySelector(".xIcon")

function toggleMenu() {
  if (menu.classList.contains("showMenu")) {
    menu.classList.remove("showMenu");
    xIcon.style.display = "none";
    menuIcon.style.display = "block";
  } else {
    menu.classList.add("showMenu");
    xIcon.style.display = "block";
    menuIcon.style.display = "none";
  }
}

var menuLinks = document.querySelectorAll(".menuLink")

menuLinks.forEach(
  function (menuLink) {
    menuLink.addEventListener("click", toggleMenu)
  }
)
  }

const endpoint = 'https://jsonplaceholder.typicode.com/users';
$.ajax({
  type: "GET",
  url: endpoint,
  dataType: "json",
  success: function (response) {
    const charge = [];
    charge.push(...response);
    createDomElement(charge);
  },
  error: function (thrownError) {
    console.log(thrownError);
  }
});

function createDomElement(charge) {
  const domElements = charge.map( user => {
    return `
  <li class="m-2 p-5">
    <p class="name">Name: ${ user.name } ${ user.username }</p>
    <p class="email">EMail: ${user.email}</p>
    <p class="Phone">Phone Number: ${user.phone}</p>
    <p class="address">Address: ${user.address.suite} ${user.address.street} ${user.address.city} ${user.address.zipcode}</p>
  </li>
`;
  }).join("");

  const chargeList = document.querySelector('.charge-list');
  chargeList.innerHTML = domElements;
}  




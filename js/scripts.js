//UTILIZE fetch to get 12 user objects from randomuser.me/api
const get12Users = async () => {
    const response = await fetch('https://randomuser.me/api/?results=12&nat=us');
    const data = await response.json();
    return data.results;
};

//MAIN CLASS - handles all ui elements
class UI {
    constructor(users, current){
        this.users = users;
        this.filtered = null;
        this.current = 0;
    }

    //FUNCTION - displays the search element
    createSearch = () => {
        const newHTML = `
            <form action="#" method="get">
                <input type="search" id="search-input" class="search-input" placeholder="Search...">
                <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
            </form>
        `;
        document.querySelector('.search-container').insertAdjacentHTML('beforeend', newHTML);
    }
           
    //FUNCTION - displays the gallery element with dynamic information
    createGalleryItem = (user) => {
        const newElement = document.createElement('div');
        newElement.className = 'card';
        newElement.innerHTML = `
            <div class="card-img-container">
                <img class="card-img" src="${user.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                 <p class="card-text">${user.email}</p>
                <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
            </div>
        `;
    
        newElement.addEventListener('click', this.galleryItemHandler);
        document.querySelector('#gallery').insertAdjacentElement('beforeend', newElement);
    }
    
    //EVENT HANDLER - on click of gallery cards will open up modal with correct index
    galleryItemHandler = (e) => {
        const card = e.currentTarget.querySelector('.card-info-container');
        const email = card.firstElementChild.nextElementSibling.textContent;
        const usersList = this.filtered || this.users;

        //set this.current on every click before modal is created
        const user = usersList.filter((user, index) => {
            if (user.email === email){
                this.current = index;
                return user;
            }
        });
        
        //create modal with found user
        this.createModal(user[0], usersList);
    }
        
    //FUNCTION - creates a modal, displays more user information from user object, adds forward and backward buttons
    createModal = (user, usersList) => {
        console.log(this.filtered);
        

        this.removeModal();

        //DISPLAY NEW MODAL 
        const newElement = document.createElement('div');
        newElement.className = 'modal-container';
    
        const phoneRegExp = /^\((\d{3})\)-(\d{3})-(\d{4})$/;
        const bdayRegExp = /^(\d{4})-(\d{2})-(\d{2})[\w\W]*$/;
          
        newElement.innerHTML = `
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                    <p class="modal-text">${user.email}</p>
                    <p class="modal-text cap">${user.location.city}</p>
                    <hr>
                    <p class="modal-text">${user.phone.replace(phoneRegExp, '($1) $2-$3')}</p>
                    <p class="modal-text">${user.location.street.number} ${user.location.street.name} ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
                    <p class="modal-text">Birthday: ${user.dob.date.replace(bdayRegExp, '$2/$3/$1')}</p>
                </div>
            </div>
        
            
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        `;
    
        document.body.insertAdjacentElement('beforeend', newElement);
    

        //NAVIGATION BUTTONS
        document.querySelector('#modal-prev').addEventListener('click', (e) => {
            if (this.current === 1){
                this.current--;
                this.createModal(usersList[this.current], usersList);
                document.querySelector('#modal-prev').style.display = 'none';
            }
            if (this.current > 1){
                this.current--;
                this.createModal(usersList[this.current], usersList);
            }
        });
    
        
        document.querySelector('#modal-next').addEventListener('click', (e) => {

            const finalIndex = usersList.length - 2;

            if (this.current === finalIndex){
                this.current++;
                this.createModal(usersList[this.current], usersList);
                document.querySelector('#modal-next').style.display = 'none';
            }
            if (this.current < finalIndex){
                this.current++;
                this.createModal(usersList[this.current], usersList);
            }
        });
    
        document.querySelector('#modal-close-btn').addEventListener('click', (e) => {
            this.removeModal();
        });
    }
        
    //FUNCTION - removes the current modal if it exists
    removeModal = () => {
        const modal = document.querySelector('.modal-container');
        if (modal){
            modal.remove();
        }
    }
        
    //EVENT HANDLER - for search , filters current users, updates display, case insensitive
    searchEventHandler = (e) => {
        this.filtered = this.users.filter(user => {
            const name = `${user.name.first.toLowerCase()} ${user.name.last.toLowerCase()}`;
            if (name.includes(e.target.value.toLowerCase())){
                return user;
            }
        })
    
        //display filtered users
        document.querySelector('#gallery').innerHTML = ``;
        this.filtered.forEach(user => {
            this.createGalleryItem(user);
        });
    }

}


// MAIN APP FUNCTION
(async function app() {
//GET USERS FROM API
const users = await get12Users();

//create instance of ui object
const ui = new UI(users, 0);

//display all users and set event listeners
users.forEach(user => {
    ui.createGalleryItem(user);
});

//create search and set event listener 
ui.createSearch();
const searchInput = document.querySelector('#search-input');
searchInput.addEventListener('keyup', ui.searchEventHandler);

})() 
    


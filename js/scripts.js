(async () => {
    const get12User = async () => {
        const response = await fetch('https://randomuser.me/api/?results=12&nat=us');
        const data = await response.json();
        return data.results;
    };

    createSearch = () => {
        const newHTML = `
            <form action="#" method="get">
                <input type="search" id="search-input" class="search-input" placeholder="Search...">
                <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
            </form>
        `;
        document.querySelector('.search-container').insertAdjacentHTML('beforeend', newHTML);
    }
       
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
    
        newElement.addEventListener('click', galleryItemHandler);
        document.querySelector('#gallery').insertAdjacentElement('beforeend', newElement);
    }
    
    
    let current = 0;
    createModal = (users, user) => {
        removeModal();
        const newElement = document.createElement('div');
        newElement.className = 'modal-container';
        console.log(user);
        phoneRegExp = /^\((\d{3})\)-(\d{3})-(\d{4})$/;
        bdayRegExp = /^(\d{4})-(\d{2})-(\d{2})[\w\W]*$/;
        console.log(user.location);
        console.log();
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
    
            // IMPORTANT: Below is only for exceeds tasks 
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        `;
        document.body.insertAdjacentElement('beforeend', newElement);
    
        const prevBtn = document.querySelector('#modal-prev')
        prevBtn.addEventListener('click', (e) => {
            const firstIndex = 0;
            console.log(current);
            if (current != 0){
                current--;
                createModal(users, users[current])
            } else{
                prevBtn.setAttribute('disabled', true);
            }
        });

        const nextBtn = document.querySelector('#modal-next')
        nextBtn.addEventListener('click', (e) => {
            const finalIndex = users.length - 1;
            console.log(current,finalIndex);
            if (current < finalIndex){
                current++;
                createModal(users, users[current])
            } else{
                nextBtn.setAttribute('disabled', true);
            }
        });

        document.querySelector('#modal-close-btn').addEventListener('click', (e) => {
            removeModal();
        });
    }
    




     removeModal = () => {
         const modal = document.querySelector('.modal-container');
         if (modal){
             modal.remove();
         }
     }
    
    
     const galleryItemHandler = (e) => {
         const card = e.currentTarget.querySelector('.card-info-container');
         const email = card.firstElementChild.nextElementSibling.textContent;
         const user = users.filter((user, index) => {
            if (user.email === email){
                current = index;
                return user;
            }
        });
        //create modal with found user
        createModal(users, user[0]);
     }


    //GET USERS FROM API
    // const user = await getUser();
    const users = await get12User();

    //display all users
    users.forEach(user => {
        createGalleryItem(user);
    });

    //create search and set event listener 
    createSearch();
    const searchInput = document.querySelector('#search-input');
    searchInput.addEventListener('keyup', e => {
        const filtered = users.filter(user => {
            const name = `${user.name.first.toLowerCase()} ${user.name.last.toLowerCase()}`;
            if (name.includes(e.target.value.toLowerCase())){
                return user;
            }
        })

        //display filtered users
        document.querySelector('#gallery').innerHTML = ``;
        filtered.forEach(user => {
            createGalleryItem(user);
        });
    });
})();

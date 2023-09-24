let form = document.getElementById('form');
let userName = document.getElementById('name');
let email = document.getElementById('email');
let birthday = document.getElementById('birthday');
let action = document.getElementById('action');
let resetAction = document.getElementById('resetAction');
let idContact = document.getElementById('id');
let message = document.getElementById('message')
let table = document.getElementById('table');

let contactList = [];
let urlDB = 'https://contactos-71abf-default-rtdb.firebaseio.com/';

let begin = () => {
    form.reset();
    idContact.value = '';
    action.value = 'add';
    userName.focus();

    let getContactList = () => {
        fetch(urlDB + 'contacts.json')
            .then(response => response.json())
            .then(data => {
                contactList = data;
                return contactList;
            })
        .catch(error => console.log(error));
    }
    getContactList();
}
begin();
class Contact {
    constructor(id, name, email, birthday) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.birthday = birthday;
    }

    fetchGetContact() {
        fetch(urlDB + 'contacts.json')
            .then(response => response.json())
            .then(data => {
                contactList = data;
                return contactList;
            })
        .catch(error => console.log(error));
    }

    fetchPostContact() {
        let contact = new Contact(id.value, userName.value, email.value, birthday.value);
        if (contact.id == '') {
            contact.id = Object.keys(contactList).length + 1;
        }

        fetch(urlDB + 'contacts.json', {
            method: 'POST',
            body: JSON.stringify(contact),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(response => response.json())
        .catch(error => console.log(error));
    }

    fetchPutContact(id) {
        let contact = {
            id: idContact.value,
            name: userName.value,
            email: email.value,
            birthday: birthday.value
        }

        let idDel;
        Object.entries(contactList).forEach(([key, value]) => {
            console.log(key, value);
            if (contact.id == value.id) {
                return idDel = key;
            }
        });

        fetch(urlDB + 'contacts/' + idDel + '.json', {
            method: 'PUT',
            body: JSON.stringify(contact),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));
    }

    fetchDeleteContact(id) {
        let contact = {
            id: idContact.value,
            name: userName.value,
            email: email.value,
            birthday: birthday.value
        }

        let idDel;
        Object.entries(contactList).forEach(([key, value]) => {
            console.log(key, value);
            if (contact.id == value.id) {
                return idDel = key;
            }
        });

        fetch(urlDB + 'contacts/' + idDel + '.json', {
            method: 'DELETE',
            body: JSON.stringify(contact),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(response => response.json())
        .catch(error => console.log(error));
    }
}

let contact = new Contact();

setTimeout(() => {
    contactList ? renderContacts() : table.innerHTML = `
    <tr>
        <td colspan="5">🛰️No hay contactos cargados en la base de datos🛰️</td>
    </tr>`
}, 1000);

let renderContacts = () => {
    let data = Object.values(contactList) ? Object.values(contactList) : data = [];
    table.innerHTML = `<table class="table">
    <caption>
        <h4>Lista de contactos</h4>
    </caption>
    <thead>
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Fecha de nacimiento</th>
            <th>Acciones</th>
        </tr>
    </thead>`;
    data.forEach(element => {
        let birthdate = element.birthday.split('-').reverse().join('/');
        table.innerHTML += `
            <tr>
                <td>${element.id}</td>
                <td>${element.name}</td>
                <td>${element.email}</td>
                <td>${birthdate}</td>
                <td><button class="btn btn-danger"
                onclick="deleteContact(${element.id})">Borrar</button>
                <button class="btn btn-warning"
                onclick="updateContact(${element.id})">Editar</button></td>
            </tr>
        `;
    })
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let regexName = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
    let regexEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    let regexBirthday = /^\d{4}-\d{2}-\d{2}$/;
    let info = document.getElementById('info');
    info.innerHTML = '';

    if (userName.value == '' || email.value == '' || birthday.value == '') {
        info.innerHTML += 'Todos los campos son obligatorios';
        setTimeout(() => {
            info.innerHTML = '';
        }, 2000);
        return false;
    }

    if (!regexName.test(userName.value)) {
        info.innerHTML += 'El nombre no es válido';
        setTimeout(() => {
            info.innerHTML = '';
        }, 2000);
        return false;
    }

    if (!regexEmail.test(email.value)) {
        info.innerHTML += 'El email no es válido';
        setTimeout(() => {
            info.innerHTML = '';
        }, 2000);
        return false;
    }

    if (!regexBirthday.test(birthday.value)) {
        info.innerHTML += 'La fecha no es válida';
        setTimeout(() => {
            info.innerHTML = '';
        }, 2000);
        return false;
    }

    let birthdate = birthday.value.split('-').reverse().join('/');
    switch (action.value) {
        case 'add':
            contact.fetchPostContact(contact);
            table.innerHTML = '';
            message.innerHTML = `
            Contacto agregado con éxito 
            <p>Nombre: ${userName.value}</p>
            <p>Email: ${email.value}</p>
            <p>Fecha de nacimiento: ${birthdate}</p>            
            `;
            form.append(message);
            setTimeout(() => {
                message.remove();
                
            }, 3500);
            break;
        case 'update':
            contact.fetchPutContact(idContact.value);
            table.innerHTML = '';
            message.innerHTML = `
            REGISTRO DE CONTACTO ACTUALIZADO CON EXITO 
            <p>Nombre: ${userName.value}</p>
            <p>Email: ${email.value}</p>
            <p>Fecha de nacimiento: ${birthdate}</p>            
            `;
            form.append(message);
            setTimeout(() => {
                message.remove();
            }, 3500);
            break;
        case 'delete':
            contact.fetchDeleteContact(idContact.value);
            table.innerHTML = '';
            message.innerHTML = `
            REGISTRO DE CONTACTO ELIMINADO CON EXITO
            <p>Nombre: ${userName.value}</p>
            <p>Email: ${email.value}</p>
            <p>Fecha de nacimiento: ${birthdate}</p>          
            `;
            form.append(message);
            setTimeout(() => {
                message.remove();
            }, 3500);
        break;
    }
    
    setTimeout(() => {
        contact.fetchGetContact();
         setTimeout(() => {
            renderContacts();
            form.reset();
        }, 1000);
    }, 3000);
});

resetAction.addEventListener('click', function (e) {
    e.preventDefault();
    form.reset();
    idContact.value = '';
    action.value = 'add';
    userName.focus();
});

function deleteContact(id) {
    action.value = 'delete';
    userName.focus();
    idContact.value = id;
    data = Object.values(contactList);
    data.forEach(element => {
        if (element.id == id) {
            idContact.value = element.id;
            userName.value = element.name;
            email.value = element.email;
            birthday.value = element.birthday;
        }
    });
    return id;
}

function updateContact(id) {
    action.value = 'update';
    userName.focus();
    data = Object.values(contactList);
    data.forEach(element => {
        if (element.id == id) {
            idContact.value = element.id;
            userName.value = element.name;
            email.value = element.email;
            birthday.value = element.birthday;
        }
    });
    return id;
}
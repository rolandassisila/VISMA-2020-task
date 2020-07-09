//new contact class, shows the structure of the contact
class Contact {
    constructor(name, lastname, date, number, email, address, id) {
        this.name = name;
        this.lastname = lastname;
        this.date = date;
        this.number = number;
        this.email = email;
        this.address = address;
        this.id = id;
    }
}
//Function to generate random ID
function generateID () {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
class UI {
	static isEditMode;
	static editId;
    static displayContacts() {
		//function reaches to localstorage and gets the contacts
		const clients = Store.getClients();
		clients.forEach((client) => UI.addClientToList(client));
    }
    static addClientToList(client) {
        //grabbing the table elemnt aka <tbody> from DOM
        const list = document.querySelector('#contact-list');
        //creating table row elemnt
        const row = UI.createRow(client);
        //appending row to the list
        list.appendChild(row);
    }
	static createRow(client) {
		//creating table row elemnt
        const row = document.createElement('tr');
        row.id = client.id;
        //html used to create columns 
        row.innerHTML = `
        <td>${client.name}</td>
        <td>${client.lastname}</td>
        <td>${client.date}</td>
        <td>${client.number}</td>
        <td>${client.email}</td>
        <td>${client.address}</td>
		<td>
		<button class="editBtn" onclick="loadRow('${client.id}')"><i class="fa fa-pencil"></i></button>
		<button class="deletebtn" onclick="deleteRow('${client.id}')"><i class="fa fa-trash"></i></button>
		</td>
        `;
		return row;
	}
	static replaceRow(client) {
		const row = document.getElementById(client.id);
		const newRow = UI.createRow(client);
		row.parentNode.replaceChild(newRow, row);
	}
    static clearFields(){
        document.querySelector('#name').value = '';
        document.querySelector('#lastname').value = '';
        document.querySelector('#date').value = '';
        document.querySelector('#number').value = '';
        document.querySelector('#email').value = '';
        document.querySelector('#address').value = '';
		document.getElementById("lblEdit").innerHTML = "";
		document.querySelector('#submit').value = 'Add to the list';
    }
}
//Display contact
document.addEventListener('DOMContentLoaded', UI.displayContacts);
//Collecting data from form
document.querySelector('#new-contact').addEventListener('submit', (e) => {
    // Stop the actual submit
    e.preventDefault();
	if (UI.isEditMode) {
		const client = Store.editRow(UI.editId);	
		UI.replaceRow(client);
		UI.clearFields();
		UI.isEditMode = false;
		UI.editId = null;
		return;
	}
    //Get information and values from form
    const name = document.querySelector('#name').value;
    const lastname = document.querySelector('#lastname').value;
    const date = document.querySelector('#date').value;
    const number = document.querySelector('#number').value;
    const email = document.querySelector('#email').value;
    const address = document.querySelector('#address').value;
    const id = generateID();
	if (!validNumber() || !validEmail()) {
		return;
	}
    //represent client
    const client = new Contact(name, lastname, date, number, email, address, id);
    //add new client to UI
    UI.addClientToList(client);
    //add new client to store
    Store.addClient(client);
    //makes information go away from form
    UI.clearFields();
});
function validNumber() {
    if (UI.isEditMode) {
        return true;
    }
	const number = document.querySelector('#number').value;
	if (Store.clientNumberExists(number)) {
		document.getElementById("lblError").innerHTML = "Number is not unique!";
		return false;
	} else {
        document.getElementById("lblError").innerHTML = "";
	}
	return true;
}
function validEmail() {
    if (UI.isEditMode) {
        return true;
    }
	const email = document.querySelector('#email').value;
	if (Store.clientEmailExists(email)) {
		document.getElementById("lblError").innerHTML = "Email is not unique!";
		return false;
	} else {
        document.getElementById("lblError").innerHTML = "";
	}
	return true;
}
//Delete contact from UI
function deleteRow(id) {
    const row = document.getElementById(id);
    row.parentNode.removeChild(row);
    Store.removeClient(id);
}
//Delete contact from UI
function loadRow(id) {
	UI.isEditMode = true;
	UI.editId = id;
	const clients = Store.getClients();
	var client = clients.find(c => c.id === id);
	document.querySelector('#name').value = client.name;
	document.querySelector('#lastname').value = client.lastname;
	document.querySelector('#date').value = client.date;
	document.querySelector('#number').value = client.number;
	document.querySelector('#email').value = client.email;
	document.querySelector('#address').value = client.address;
    document.getElementById("lblEdit").innerHTML = "Contact is being edited...";
    document.querySelector('#submit').value = 'Apply changes';
}
//Store in local storage as strings
//JSON used to stringify objects
class Store {
    static getClients() {
        let clients;
        if (localStorage.getItem('clients') === null){
            clients = [];
        } else {
            //JSON used so the string can be used as JS array of objects
            clients = JSON.parse(localStorage.getItem('clients'));
        }
        return clients;
    }
    static addClient(client) {
        const clients = Store.getClients();
        clients.push(client);
        localStorage.setItem('clients', JSON.stringify(clients));
    }
    //removed by unique number
    static removeClient(id) {
        const clients = Store.getClients();
        const indexToDelete = clients.findIndex(client => {
            return client.id === id;
        });
        clients.splice(indexToDelete, 1);
        localStorage.setItem('clients', JSON.stringify(clients));
    }
    //target client and input values to edit
	static editRow(id) {
		const clients = Store.getClients();
        //function to find client with matching id
		var client = clients.find(c => c.id === id);
		client.name = document.querySelector('#name').value;
        client.lastname = document.querySelector('#lastname').value;
        client.date = document.querySelector('#date').value;
        client.number = document.querySelector('#number').value;
        client.email = document.querySelector('#email').value;
        client.address = document.querySelector('#address').value;
		localStorage.setItem('clients', JSON.stringify(clients));
		return client;
	}
    //validation function for number
	static clientNumberExists(number) {
		let clients = Store.getClients();
		return clients.some((client) => client.number === number);
	}
    //validation function for email
    static clientEmailExists(email) {
		let clients = Store.getClients();
		return clients.some((client) => client.email === email);
	}
}
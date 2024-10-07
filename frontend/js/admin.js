const BASE_URL = "https://iitblms-2.onrender.com";


async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;

    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, role })
        });

        const data = await response.json();
        if (data.success) {
       getUser()
        } else {
            alert(data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;

    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, role })
        });

        const data = await response.json();

        if (data.success) {
            alert('Registration successful! You can now log in.');
            window.location.href = './login.html';
        } else {
            alert(data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const role = document.getElementById('login-role').value;

    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, role })
        });
        const data = await response.json();
        if (data.success) {
            alert('Login successful! Redirecting...');
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role); // Store role in localStorage

            window.location.href = data.role === "member" ? '/frontend/html/dashboard_member.html' : "/frontend/html/dashboard_librarian.html";
        } else {
            alert(data.message || 'Some error occurred. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}


async function getBooks() {
    const token = localStorage.getItem("token");
    const tableBody = document.getElementById('book-list');
    if (!tableBody) return;

    try {
        const response = await fetch(`${BASE_URL}/api/v1/librarian/get-books`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (data.success) {
            console.log(data);
            appendDataToTable(data.books, tableBody);
        } else {
            alert(data.message || 'Failed to fetch books.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

function appendDataToTable(data, tableBody) {
    tableBody.innerHTML = '';

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No books available</td></tr>';
        return;
    }

    data.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.status}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="openEditModal(${book.id}, '${book.title}', '${book.author}', '${book.isbn}', '${book.status}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}



async function openEditModal(bookId, title, author, isbn, status) {
    document.getElementById('edit-id').value = bookId;
    document.getElementById('edit-title').value = title;
    document.getElementById('edit-author').value = author;
    document.getElementById('edit-isbn').value = isbn;
    document.getElementById('edit-status').value = status;
    $('#exampleModal').modal('show');
}

async function handleEditBook(event) {
    event.preventDefault();
    const bookId = document.getElementById('edit-id').value;
    const title = document.getElementById('edit-title').value;
    const author = document.getElementById('edit-author').value;
    const isbn = document.getElementById('edit-isbn').value;
    const status = document.getElementById('edit-status').value;
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${BASE_URL}/api/v1/librarian/update-book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, author, isbn, status })
        });

        const data = await response.json();
        if (data.success) {
            alert('Book updated successfully.');
            $('#exampleModal').modal('hide');
            getBooks(); 
        } else {
            alert(data.message || 'Failed to update book.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

async function handleAddBook(event) {
    event.preventDefault();
    const title = document.getElementById('add-title').value;
    const author = document.getElementById('add-author').value;
    const isbn = document.getElementById('add-isbn').value;
    const status = document.getElementById('add-status').value;
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${BASE_URL}/api/v1/librarian/add-book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, author, isbn, status })
        });

        const data = await response.json();
        if (data.success) {
            alert('Book added successfully.');
            $('#addBookModal').modal('hide');
            getBooks(); 
        } else {
            alert(data.message || 'Failed to add book.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}




async function viewBook() {
    const token = localStorage.getItem("token");
    const tableBody = document.getElementById('user-list');



    if (!tableBody) return;

    try {
        const response = await fetch(`${BASE_URL}/api/v1/librarian/get-all-user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            console.log(data);
            appendDataToTable(data.user, tableBody, "user");
        } else {
            alert(data.message || 'Failed to fetch books.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

async function getBooks() {
    const token = localStorage.getItem("token");
    const tableBody = document.getElementById('book-list');



    if (!tableBody) return;

    try {
        const response = await fetch(`${BASE_URL}/api/v1/librarian/get-books`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            console.log(data);
            appendDataToTable(data.books, tableBody, "books");
        } else {
            alert(data.message || 'Failed to fetch books.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

function appendDataToTable(data, tableBody, entity) {
    tableBody.innerHTML = '';

    if (data.length === 0) {
        tableBody.innerHTML = entity === "user" ? `
            <tr>
                <td colspan="5" class="text-center">
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center;">
                        No User Available.
                        
                    </div>
                </td>
            </tr>
        `: `
            <tr>
                <td colspan="5" class="text-center">
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center;">
                        No Books Available.
                        
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    data.forEach(val => {
        const row = document.createElement('tr');
        row.innerHTML = entity === "user" ? `
            <td>${val.username}</td>
            <td>${val.role}</td>
            <td><span class="badge badge-warning">${val.isActive ? "Active" : "Deactive"}</span></td>
            

            <td>
                <button class="btn btn-success btn-sm" onclick="editUser('${val.username}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="ViewUser('${username=val.username}')">View</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser('${username = val.username}')">Delete</button>
            </td>
        `: `<td>${val.title}</td>
            <td><span class="badge badge-warning">${val.author}</span></td>
            <td><span class="badge badge-warning">${val.isbn}</span></td>
            <td><span class="badge badge-warning">${val.status}</span></td>
            <td>
                <button class="btn btn-success btn-sm" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onclick="editEntity('${isbn=val.isbn}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="View('${isbn = val.isbn}')">View</button>
                <button class="btn btn-danger btn-sm" onclick="deleteEntity('${isbn = val.isbn}')">Delete</button>
            </td>`;
        tableBody.appendChild(row);
    });
}
async function deleteEntity(isbn = null, username = null) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(isbn != null ?
            `${BASE_URL}/api/v1/librarian/delete-book` :
            `${BASE_URL}/api/v1/librarian/delete-member`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: isbn != null ? JSON.stringify({ "isbn": isbn }) : JSON.stringify({ "username": username })
            });

        const data = await response.json();
        getBooks()

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

async function deleteUser(username) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${BASE_URL}/api/v1/librarian/delete-member`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body:JSON.stringify({ "username": username })
            });

        const data = await response.json();
        getUser()

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

async function editEntity(isbn = null, username = null) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(isbn != null ?
            `${BASE_URL}/api/v1/librarian/get-book/${isbn}` :
            `${BASE_URL}/api/v1/librarian/get-member/${username}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

        const data = await response.json();

        if (data.success) {
            if (isbn) {
                document.getElementById('edit-title').value = data.book.title;
                document.getElementById('edit-author').value = data.book.author;
                document.getElementById('edit-isbn').value = data.book.isbn;
            } else {
                document.getElementById('edit-username').value = data.user.username;
                document.getElementById('edit-role').value = data.user.role;
            }

            $('#editModal').modal('show');

            document.getElementById('edit-id').value = isbn || username;
        } else {
            alert(data.message || 'Failed to fetch data for editing.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

async function editUser(username) {
    const token = localStorage.getItem("token");


    try {
        const response = await fetch(`${BASE_URL}/api/v1/librarian/get-user`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
                ,
                body:JSON.stringify({"username":username})
            });

            
            const data = await response.json();
            console.log(data,"-----------------")
            
            
                document.getElementById('edit-username').innerHTML = data.data[0].role;
                document.getElementById('edit-role').val = data.data.role;

            $('#editUserModal').modal('show');

        
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}




async function View(isbn = null, username = null) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(isbn != null ?
            `${BASE_URL}/api/v1/librarian/get-book/${isbn}` :
            `${BASE_URL}/api/v1/librarian/get-member/${username}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            const data = await response.json();

        if (data.success) {
            if (isbn) {
                document.getElementById('view-title').innerHTML = data.book.title;
                document.getElementById('view-author').innerHTML = data.book.author;
                document.getElementById('view-isbn').innerHTML = data.book.isbn;
                document.getElementById('view-status').innerHTML = data.book.status;
            } else {
                document.getElementById('view-username').innerHTML = data.user.username;
                document.getElementById('view-role').innerHTML = data.user.role;
            }

            isbn?$('#viewBookModal').modal('show'):$('#viewUserModal').modal('show');

            document.getElementById('edit-id').value = isbn || username;
        } else {
            alert(data.message || 'Failed to fetch data for editing.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

async function ViewUser(username) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(
            `${BASE_URL}/api/v1/librarian/get-user`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
                ,
                body:JSON.stringify({"username":username})
            });

            const data = await response.json();
            console.log(data)

        if (data.success) {
           
                document.getElementById('view-username').innerHTML = data.data[0].username;
                document.getElementById('view-role').innerHTML = data.data[0].role;
            

                $('#viewUserModal').modal('show')

        } else {
            alert(data.message || 'Failed to fetch data for editing.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}


async function getUser() {
    const token = localStorage.getItem("token");
    const tableBody = document.getElementById('user-list');



    if (!tableBody) return;

    try {
        const response = await fetch(`${BASE_URL}/api/v1/librarian/get-all-user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            console.log(data);
            appendDataToTable(data.user, tableBody, "user");
        } else {
            alert(data.message || 'Failed to fetch books.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}


async function saveEntity(isbn = null, username = null) {
    const token = localStorage.getItem("token");


    try {
        const response = await fetch(isbn != null ?
            `${BASE_URL}/api/v1/librarian/update-book` :
            `${BASE_URL}/api/v1/librarian/update-member`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: isbn != null ? JSON.stringify({ "isbn": isbn }) : JSON.stringify({ "username": username })
            });

        const data = await response.json();
        getBooks()

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

function Logout() {
    const logout = confirm("Do You Really Want to logout");
    if (logout) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "./index.html";
    }
}

const logoutButtons = document.getElementsByClassName('logout');
Array.from(logoutButtons).forEach(button => {
    button.addEventListener('click', Logout);
});

document.getElementById('adduser')?.addEventListener('submit', handleRegister);
document.getElementById('addBookModal')?.addEventListener('submit', handleAddBook);

document.getElementById('edit-user-form')?.addEventListener('submit', editUser);







getUser();
getBooks();







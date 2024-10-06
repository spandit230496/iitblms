const BASE_URL = "http://localhost:5000";

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
            window.location.href = '/frontend/html/login.html'; 
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


async function getBorrowedBooks() {
    const token = localStorage.getItem("token");
    const tableBody = document.getElementById('borrowed-books-body');

    if (!tableBody) return; 

    try {
        const response = await fetch(`${BASE_URL}/api/v1/member/book-borrow-history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            console.log(data);
            appendBooksToTable(data.history, tableBody);
        } else {
            alert(data.message || 'Failed to fetch borrowed books.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

async function getBookList() {
    const token = localStorage.getItem("token");
    const tableBody = document.getElementById('book-list');

    if (!tableBody) return; 

    try {
        const response = await fetch(`${BASE_URL}/api/v1/member/view-all-book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            console.log(data);
            appendBooksToTable(data.book, tableBody);
        } else {
            alert(data.message || 'Failed to fetch books.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

function appendBooksToTable(books, tableBody) {
    tableBody.innerHTML = ''; 

    if (books.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center;">
                        No books borrowed.
                        <a href="./booklist.html" style="margin-top: 10px;">Borrow First Book</a>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td><span class="badge badge-warning">${book.status}</span></td>
            <td>
                ${book.status === "AVAILABLE" 
                    ? `<button class="btn btn-success btn-sm" onclick="issueBook('${book.isbn}')">Issue</button>`
                    : `<button class="btn btn-danger btn-sm" onclick="returnBook('${book.isbn}')">Return</button>`
                }
            </td>
        `;
        tableBody.appendChild(row);
    });
    
}

async function returnBook(bookId) {
    const token = localStorage.getItem("token");

    alert(bookId)

    try {
        const response = await fetch(`${BASE_URL}/api/v1/member/return-book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body:JSON.stringify({ isbn:bookId})
        });

        const data = await response.json();

        if (data.success) {
            alert('Book returned successfully.');
            getBorrowedBooks(); 
        } else {
            alert(data.message || 'Failed to return book.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

async function issueBook(bookId) {
    const token = localStorage.getItem("token");

    alert(bookId)

    try {
        const response = await fetch(`${BASE_URL}/api/v1/member/borrow-book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body:JSON.stringify({ isbn:bookId})
        });

        const data = await response.json();

        if (data.success) {
            alert('Book issued successfully.');
            getBorrowedBooks(); 
        } else {
            alert(data.message || 'Failed to return book.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

async function deleteAccount() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${BASE_URL}/api/v1/member/delete-account`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (data.success) {
            alert('Account deleted successfully.');
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = '/frontend/html/login.html'; 
        } else {
            alert(data.message || 'Failed to delete account.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}



async function viewProfile() {
   

    const token = localStorage.getItem("token");
    const profile=document.getElementById("profile")

    console.log(profile);
    

    profile.innerHTML=""
 
    try {
        const response = await fetch(`${BASE_URL}/api/v1/member/view-profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        profile.innerHTML = `
    <td>${data.data.username}</td>
    <td>Status: ${data.data.isActive === true ? "Active" : "Deactive"}</td>
    <button onclick="deleteAccount()">Delete Account</button>
`;

        

        if (data.success) {
        } else {
            alert(data.message || 'Failed to Fetch.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}



function checkAuthentication() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
        if (role === "member") {
            window.location.href = '/frontend/html/dashboard_member.html';
        } else if (role === "librarian") {
            window.location.href = '/frontend/html/dashboard_librarian.html';
        }
    }
}


function Logout() {
    const logout = confirm("Do You Really Want to logout");
    if (logout) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/frontend/html/index.html";
    }
}


document.getElementById('register-form')?.addEventListener('submit', handleRegister);
document.getElementById('login-form')?.addEventListener('submit', handleLogin);


const logoutButtons = document.getElementsByClassName('logout');
Array.from(logoutButtons).forEach(button => {
    button.addEventListener('click', Logout);
});

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('borrowed-books-body')) {
        getBorrowedBooks(); 
    }

    if (document.getElementById('book-list')) {
        getBookList(); 
    }
    viewProfile()
    checkAuthentication
});

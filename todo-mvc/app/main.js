let state = {
    loggedIn: false,
    username: "",
    notifications: 0,
};


let oldState = {
    notifications: "",
    user: ""
};

function NotificationComponent() {
    return `
        <p>Notifications: ${state.notifications}</p>
        <button onclick="addNotification()">Add Notification</button>
    `;
}

function UserComponent() {
    return `<h1>Hello, ${state.username}!</h1>`;
}

function render() {
    const app = document.getElementById("app");

    const newNotifications = NotificationComponent();
    if (newNotifications !== oldState.notifications) {
        const notificationsDiv = document.getElementById("notifications");
        notificationsDiv.innerHTML = newNotifications;
        oldState.notifications = newNotifications;
    }

    if (state.loggedIn) {
        const newUser = UserComponent();
        if (newUser !== oldState.user) {
            const userDiv = document.getElementById("user");
            userDiv.innerHTML = newUser;
            oldState.user = newUser;
        }
    } else {
        const loginDiv = document.getElementById("login");
        loginDiv.innerHTML = '<button onclick="login(\'JohnDoe\')">Login as JohnDoe</button>';
    }
}

function login(user) {
    state.loggedIn = true;
    state.username = user;
    render();
}

function addNotification() {
    state.notifications += 1;
    render();
}

window.onload = function () {
    render();
};

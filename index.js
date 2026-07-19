
function login() {

    let role =
        document.querySelector(
            'input[name="role"]:checked'
        ).value;

    let id =
        document.getElementById("userId").value;

    let password =
        document.getElementById("password").value;

    let message =
        document.getElementById("message");

   
    if (
        role === "student" &&
        id === "24571" &&
        password === "Jaiswal@2004"
    ) {

        message.style.color = "green";
        message.innerHTML =
            "Student Login Successful";

        setTimeout(() => {
            window.location.href =
                "Student Dashboard.html";
        }, 1000);
    }

    // Teacher Login
    else if (
        role === "teacher" &&
        id === "77229" &&
        password === "naman@2026"
    ) {

        message.style.color = "green";
        message.innerHTML =
            "Teacher Login Successful";

        setTimeout(() => {
            window.location.href =
                "Teacher.html";
        }, 1000);
    }

    else {

        message.style.color = "red";
        message.innerHTML =
            "Invalid ID or Password";
    }
}

function showPassword() {

    let pass =
        document.getElementById("password");

    if (pass.type === "password") {
        pass.type = "text";
    }
    else {
        pass.type = "password";
    }
}
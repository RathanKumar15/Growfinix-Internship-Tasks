const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const message = document.getElementById("message");

loginTab.addEventListener("click", () => {
loginForm.classList.remove("hidden");
registerForm.classList.add("hidden");

loginTab.classList.add("active");
registerTab.classList.remove("active");
});

registerTab.addEventListener("click", () => {
registerForm.classList.remove("hidden");
loginForm.classList.add("hidden");

registerTab.classList.add("active");
loginTab.classList.remove("active");
});

document.querySelectorAll(".toggle-password")
.forEach(icon => {

icon.addEventListener("click", () => {

const input =
icon.previousElementSibling;

input.type =
input.type === "password"
? "text"
: "password";
});
});

const emailRegex =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

function showMessage(text,type){

message.textContent=text;

message.className=
type==="success"
? "success"
: "failure";
}

loginForm.addEventListener(
"submit",
function(e){

e.preventDefault();

const email =
document.getElementById("loginEmail").value;

const password =
document.getElementById("loginPassword").value;

if(!emailRegex.test(email)){
showMessage(
"Invalid Email",
"error"
);
return;
}

if(!passwordRegex.test(password)){
showMessage(
"Weak Password",
"error"
);
return;
}

showMessage(
"Logging In...",
"success"
);

setTimeout(()=>{

showMessage(
"Login Successful!",
"success"
);

},2000);

});

registerForm.addEventListener(
"submit",
function(e){

e.preventDefault();

const name =
document.getElementById("fullName").value;

const email =
document.getElementById("registerEmail").value;

const password =
document.getElementById("registerPassword").value;

const confirm =
document.getElementById("confirmPassword").value;

const terms =
document.getElementById("terms").checked;

if(name.length < 3){
showMessage(
"Name must be at least 3 characters",
"error"
);
return;
}

if(!emailRegex.test(email)){
showMessage(
"Invalid Email",
"error"
);
return;
}

if(!passwordRegex.test(password)){
showMessage(
"Password must contain uppercase, lowercase, number and special character",
"error"
);
return;
}

if(password !== confirm){
showMessage(
"Passwords do not match",
"error"
);
return;
}

if(!terms){
showMessage(
"Accept Terms & Conditions",
"error"
);
return;
}

showMessage(
"Registration Successful!",
"success"
);

});
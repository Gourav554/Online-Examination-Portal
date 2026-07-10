// Notification 

let notification = document.querySelector(".notification span");

notification.addEventListener("click", () => {
  notification.style.display = "none";
});

//  Dynamic Data

const percentage = 80;

if (percentage >= 40) {
  document.querySelector(".status").innerText = "Passed";
} else {
  document.querySelector(".status").innerText = "Failed";
}
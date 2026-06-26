let totalSeconds = 59 * 60 + 42;

function updateTimer() {

    let minutes =
        Math.floor(totalSeconds / 60);

    let seconds =
        totalSeconds % 60;

    document.getElementById("time")
        .innerHTML =
        `${String(minutes).padStart(2, "0")}
        :
        ${String(seconds).padStart(2, "0")}`;

    if (totalSeconds > 0) {
        totalSeconds--;
    }
}

setInterval(updateTimer, 1000);
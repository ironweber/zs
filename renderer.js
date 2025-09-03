const TIMER_DUR = 1000
const TIMER_STATE = {
  IDLE: "IDLE",
  RUNNING: "RUNNING",
  PAUSED: "PAUSED",
}

let CURRENT_STATE = TIMER_STATE.IDLE
let CURRENT_TIMER = TIMER_DUR

const d = document
const duration = d.getElementById("duration")
const counter = d.getElementById("counter")
const player = d.getElementById("player")

const startBtn = d.getElementById("start-btn")
// const stopBtn = d.getElementById("stop-btn")
const resetBtn = d.getElementById("reset-btn")

const hideDurationCb = d.getElementById("hide-duration-cb")

let timerId = 0
function formatTime(currentTime) {
  const remaingMins = Math.floor(currentTime / 60)
  const remaingSecs = currentTime - remaingMins * 60
  const remainingTime = `${remaingMins < 10 ? "0" + remaingMins : remaingMins}:${remaingSecs < 10 ? "0" + remaingSecs : remaingSecs}`

  return remainingTime
}

function updateRemainingDuration(currentTime, el) {
  const remainingTime = formatTime(currentTime)

  if (el) {
    el.innerHTML = remainingTime
  }
}

function hideMenubarDuration() {
  let hideMenubarDuration = localStorage.getItem("hide-menubar-duration")
  hideMenubarDuration = +hideMenubarDuration === 1
  return hideMenubarDuration
}

function emitDuration(currentTime) {
  const isMenubarHidden = hideMenubarDuration()
  const duration = isMenubarHidden ? null : formatTime(currentTime)
  window?.electronAPI.setTrayIcon(duration);
}
function main() {
  player.volume = 0.25
  // Add the formatted time to the page on page load.
  let startTime = duration.value * 60
  let currentTime = startTime

  if (hideMenubarDuration()) {
    if (hideDurationCb) {
      hideDurationCb.checked = true
    }
  }
  updateRemainingDuration(startTime, counter)
  emitDuration(currentTime)

  hideDurationCb.addEventListener("click", () => {
    const value = localStorage.getItem("hide-menubar-duration")
    if (!value || value == 0) {
      localStorage.setItem("hide-menubar-duration", 1)
    } else {
      localStorage.setItem("hide-menubar-duration", 0)
    }

    emitDuration(currentTime)
  })

  resetBtn.addEventListener("click", () => {
    let startTime = duration.value * 60
    updateRemainingDuration(startTime, counter)
    currentTime = startTime
    emitDuration(currentTime)
  })

  // Add event listener for button.
  startBtn.addEventListener("click", () => {
    // if this is the first time clicking button set it to the defaultTime (from the input)
    currentTime =
      CURRENT_STATE === TIMER_STATE.IDLE ? duration.value * 60 : currentTime

    if (timerId) clearInterval(timerId)

    // Toggle the current state and update the button.
    if (CURRENT_STATE === TIMER_STATE.RUNNING) {
      setCurrentState(TIMER_STATE.PAUSED)
      startBtn.classList.remove("running", "pause")
      startBtn.classList.add(["play"])
      return
    }

    // Toggle the current state and update the button.
    if ([TIMER_STATE.IDLE, TIMER_STATE.PAUSED].includes(CURRENT_STATE)) {
      setCurrentState(TIMER_STATE.RUNNING)
      startBtn.classList.add("running", "pause")
    }

    // Timer interval every 1000ms (1s)
    timerId = setInterval(() => {
      currentTime = currentTime - 1

      if (currentTime <= 0) {
        player.play()
        clearInterval(timerId)

        startBtn.classList.remove("running", "pause")
        startBtn.classList.add("play")
      }

      updateRemainingDuration(currentTime, counter)
      emitDuration(currentTime)
    }, TIMER_DUR)
  })
  duration.addEventListener('focus', () => {
    duration.select()
  })
}
main()

// Helper functions
function setCurrentState(state) {
  if (TIMER_STATE[state]) {
    CURRENT_STATE = TIMER_STATE[state]
  }
}



// const information = document.getElementById('info')
// information.innerText = `This app is using Chrome (v${versions.chrome()}, Node.js (${versions.node()}), and Electron (${versions.electron()})`

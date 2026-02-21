// --------------------
// ROUTINE DEFINITION
// --------------------

const routine = [
  {
    name: "Frog Stretch",
    image: "images/frog.png",
    sets: 3,
    substeps: [{ label: "Main", work: 20, rest: 30 }],
  },
  {
    name: "Hip Openers",
    image: "images/hip.png",
    sets: 3,
    substeps: [{ label: "Main", work: 20, rest: 30 }],
  },
  {
    name: "Hamstrings",
    image: "images/hamstring.png",
    sets: 3,
    substeps: [
      { label: "Hamstring A", work: 20, rest: 30 },
      { label: "Hamstring B", work: 20, rest: 30 },
    ],
  },
  {
    name: "Calf Stretch",
    image: "images/calf.png",
    sets: 3,
    substeps: [{ label: "Main", work: 20, rest: 30 }],
  },
  {
    name: "Upper Body",
    image: "images/upper.png",
    sets: 3,
    substeps: [
      { label: "Forearm / Pec", work: 20, rest: 30 },
      { label: "Shoulder Behind", work: 20, rest: 30 },
      { label: "Lats", work: 20, rest: 30 },
    ],
  },
  {
    name: "Lower Back / Side",
    image: "images/lowerback.png",
    sets: 3,
    substeps: [{ label: "Main", work: 20, rest: 30 }],
  },
];

// --------------------
// STATE MACHINE
// --------------------

let timeline = [];
let currentIndex = 0;
let timeRemaining = 0;
let timerInterval = null;
let isRunning = false;

function buildTimeline() {
  timeline = [];

  routine.forEach((exercise, exIndex) => {
    for (let set = 1; set <= exercise.sets; set++) {
      exercise.substeps.forEach((sub) => {
        timeline.push({
          type: "WORK",
          exercise: exercise.name,
          substep: sub.label,
          duration: sub.work,
          image: exercise.image,
          set: set,
          totalSets: exercise.sets,
        });

        timeline.push({
          type: "REST",
          exercise: exercise.name,
          substep: sub.label,
          duration: sub.rest,
          image: exercise.image,
          set: set,
          totalSets: exercise.sets,
        });
      });
    }

    // Adjust time between exercises
    if (exIndex < routine.length - 1) {
      timeline.push({
        type: "ADJUST",
        exercise: "Adjust",
        substep: "",
        duration: 30,
        image: "",
        set: "",
        totalSets: "",
      });
    }
  });
}

function startRoutine() {
  if (!timeline.length) buildTimeline();
  if (isRunning) return;

  isRunning = true;

  if (timeRemaining === 0) {
    loadStep();
  }

  timerInterval = setInterval(tick, 1000);
}

function pauseRoutine() {
  clearInterval(timerInterval);
  isRunning = false;
}

function skipStep() {
  currentIndex++;
  if (currentIndex < timeline.length) {
    loadStep();
  } else {
    finishRoutine();
  }
}

function tick() {
  timeRemaining--;
  updateTimer();

  if (timeRemaining <= 0) {
    currentIndex++;
    if (currentIndex < timeline.length) {
      loadStep();
    } else {
      finishRoutine();
    }
  }
}

function loadStep() {
  const step = timeline[currentIndex];
  timeRemaining = step.duration;

  document.getElementById("phaseTitle").innerText =
    `${step.exercise} - ${step.type}`;

  document.getElementById("setInfo").innerText = step.set
    ? `Set ${step.set} / ${step.totalSets} (${step.substep})`
    : "";

  document.getElementById("exerciseImage").src = step.image || "";

  updateTimer();
}

function updateTimer() {
  document.getElementById("timer").innerText = timeRemaining;
}

function finishRoutine() {
  pauseRoutine();
  document.getElementById("phaseTitle").innerText = "Complete 🎉";
  document.getElementById("setInfo").innerText = "";
  document.getElementById("timer").innerText = "";
}

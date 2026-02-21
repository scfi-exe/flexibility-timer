// --------------------
// ROUTINE DEFINITION
// --------------------
const workSound = new Audio("sounds/work.wav");
const restSound = new Audio("sounds/rest.wav");

const routine = [
  {
    name: "Frog Stretch (Dynamic)",
    image: "images/frog.png",
    sets: 3,
    substeps: [{ label: "Main", work: 20, rest: 30 }],
  },
  {
    name: "Hip Openers (Dynamic)",
    image: "images/hip.png",
    sets: 3,
    substeps: [
      { label: "Left Leg", work: 20, rest: 5 },
      { label: "Right Leg", work: 20, rest: 30 },
    ],
  },
  {
    name: "Hamstrings (Dynamic)",
    image: "images/hamstring.png",
    sets: 3,
    substeps: [
      { label: "Left Hamstring A", work: 20, rest: 5 },
      { label: "Right Hamstring A", work: 20, rest: 5 },
      { label: "Left Hamstring B", work: 20, rest: 5 },
      { label: "Right Hamstring B", work: 20, rest: 30 },
    ],
  },
  {
    name: "Calf Stretch (Dynamic)",
    image: "images/calf.png",
    sets: 3,
    substeps: [
      { label: "Left Leg", work: 20, rest: 5 },
      { label: "Right Leg", work: 20, rest: 30 },
    ],
  },
  {
    name: "Upper Body (Static)",
    image: "images/upper.png",
    sets: 3,
    substeps: [
      { label: "Left Forearm / Pec", work: 20, rest: 5 },
      { label: "Right Forearm / Pec", work: 20, rest: 5 },
      { label: "Left Shoulder Behind", work: 20, rest: 5 },
      { label: "Right Shoulder Behind", work: 20, rest: 5 },
      { label: "Lats (Left)", work: 20, rest: 5 },
      { label: "Lats (Right)", work: 20, rest: 30 },
    ],
  },
  {
    name: "Lower Back / Side (Static)",
    image: "images/lower.png",
    sets: 3,
    substeps: [
      { label: "Lower Back", work: 20, rest: 10 },
      { label: "Left Shoulder - Side", work: 20, rest: 5 },
      { label: "Right Shoulder - Side", work: 20, rest: 30 },
    ],
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

  //10 second prep phase
  const firstExercise = routine[0];

  timeline.push({
    type: "PREP",
    exercise: firstExercise.name,
    substep: "Get into position!",
    duration: 10,
    image: firstExercise.image,
    set: "",
    totalSets: "",
  });

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
      const nextExercise = routine[exIndex + 1];

      timeline.push({
        type: "ADJUST",
        exercise: nextExercise.name,
        substep: `Next: ${nextExercise.name}`,
        duration: 30,
        image: nextExercise.image,
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

  if (step.type === "WORK") {
    document.getElementById("phaseTitle").innerText = step.exercise;
  } else if (step.type === "REST") {
    document.getElementById("phaseTitle").innerText = `${step.exercise} - Rest`;
  } else if (step.type === "ADJUST") {
    document.getElementById("phaseTitle").innerText =
      `Prepare for ${step.exercise}`;
  } else if (step.type === "PREP") {
    document.getElementById("phaseTitle").innerText =
      `Prepare for ${step.exercise}`;
  }

  document.getElementById("setInfo").innerText = step.set
    ? `Set ${step.set} / ${step.totalSets} (${step.substep})`
    : "";

  document.getElementById("exerciseImage").src = step.image || "";

  // SOUND LOGIC
  if (step.type === "WORK") {
    workSound.play();
  } else if (step.type === "REST") {
    restSound.play();
  } else if (step.type === "PREP") {
    workSound.play();
  }

  //background color switch
  document.body.classList.remove("work", "rest", "adjust", "prep");

  if (step.type === "WORK") {
    document.body.classList.add("work");
  } else if (step.type === "REST") {
    document.body.classList.add("rest");
  } else if (step.type === "ADJUST") {
    document.body.classList.add("adjust");
  } else if (step.type === "PREP") {
    document.body.classList.add("prep");
  }

  //Update progress
  updateProgress();

  updateTimer();
}

function updateProgress() {
  const percent = (currentIndex / timeline.length) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
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

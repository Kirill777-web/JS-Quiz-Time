document.addEventListener('DOMContentLoaded', function () {
  var startButton = document.querySelector('.start-btn');
  var timerDisplay = document.querySelector('.timer');
  var header = document.querySelector('header');
  var questionChoice = document.querySelector('.question-choice');
  var choicesList = document.querySelector('.choices');
  var rightWrongDisplay = document.querySelector('.right-wrong-answer');
  var viewHighScores = document.querySelector('.view.highscore');

  var currentQuestionIndex = 0;
  var score = 0;
  var timeLeft = 75;
  var timerInterval;
  var questions = [
    {
      question: 'What is the extension of a JavaScript file?',
      choices: ['.JS', '.Java', '.XML', '.HTML'],
      correctAnswer: '.JS',
    },
    {
      question: 'What are the scopes of a variable in JavaScript?',
      choices: ['Global', 'Local', 'Both', 'None'],
      correctAnswer: 'Both',
    },
    {
      question: 'What is the correct syntax for an if statement?',
      choices: ['if x = 5', 'if x == 5', 'if (x == 5)', 'if x == 5 then'],
      correctAnswer: 'if (x == 5)',
    },
    {
      question: '  What is DOM?',
      choices: [
        'The Document Object Model',
        'CSS system for managing HTML',
        ' Sequence of HTML element loading',
        '3D graphics API for HTML',
      ],
      correctAnswer: 'The Document Object Model',
    },
  ];

  viewHighScores.addEventListener('click', function () {
    // Hide other content
    header.style.display = 'none';
    questionChoice.style.display = 'none';
    choicesList.style.display = 'none';
    timerDisplay.style.display = 'none';
    startButton.style.display = 'none';

    // Check if end-form exists and remove it
    var endForm = document.querySelector('.end-form');
    if (endForm) {
      endForm.remove();
    }
    // Create or clear the scoreboard
    var scoreboard = document.querySelector('.scoreboard');
    if (!scoreboard) {
      scoreboard = document.createElement('div');
      scoreboard.classList.add('scoreboard');
      document.querySelector('.quiz').appendChild(scoreboard);
    } else {
      scoreboard.innerHTML = ''; // clears the scoreboard for new scores
    }

    displayScores(scoreboard);
  });

  function displayQuestion(index) {
    var currentQuestion = questions[index];
    questionChoice.textContent = currentQuestion.question;
    choicesList.innerHTML = '';
    currentQuestion.choices.forEach(function (choice) {
      var li = document.createElement('li');
      li.textContent = choice;
      choicesList.appendChild(li);
    });
  }

  function displayScores(parentElement) {
    parentElement.innerHTML = ''; // Clear previous content
    var scores = JSON.parse(localStorage.getItem('scores')) || [];
    var header = document.createElement('h2');
    header.textContent = 'HighScores';
    parentElement.appendChild(header);

    scores.forEach(function (entry, index) {
      var p = document.createElement('p');
      p.textContent = `Attempt ${index + 1}: ${entry.initials} - ${
        entry.score
      } points`;
      parentElement.appendChild(p);
    });

    // "Start Again" Button
    var startAgainBtn = document.createElement('button');
    startAgainBtn.textContent = 'Start Again';
    parentElement.appendChild(startAgainBtn);

    startAgainBtn.addEventListener('click', function () {
      location.reload();
    });

    if (scores.length > 0) {
      // Only display reset button if there are scores
      var resetBtn = document.createElement('button');
      resetBtn.textContent = 'Reset Scores';
      parentElement.appendChild(resetBtn);

      resetBtn.addEventListener('click', function () {
        localStorage.removeItem('scores');
        parentElement.innerHTML = ''; // Clear the display
        displayScores(parentElement); // Refresh the scores display
      });
    }
  }

  function endQuiz() {
    clearInterval(timerInterval);
    questionChoice.style.display = 'none';
    choicesList.style.display = 'none';
    var form = document.createElement('form');
    form.classList.add('end-form');
    form.innerHTML = `<h2>Quiz Over!</h2><p>Your score: ${score}</p><input type="text" placeholder="Enter your initials"><button type="submit">Save Score</button>`;
    document.querySelector('.quiz').appendChild(form);
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var initials = event.target.querySelector('input').value;
      var scores = JSON.parse(localStorage.getItem('scores')) || [];
      scores.push({ initials, score: score });
      localStorage.setItem('scores', JSON.stringify(scores));
      form.innerHTML = '';
      displayScores(form);
    });
  }

  startButton.addEventListener('click', function () {
    timerInterval = setInterval(function () {
      timeLeft--;
      timerDisplay.textContent = 'Timer: ' + timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endQuiz();
      }
    }, 1000);
    questionChoice.style.display = 'block';
    choicesList.style.display = 'block';
    header.style.display = 'none';
    displayQuestion(currentQuestionIndex);
  });

  choicesList.addEventListener('click', function (event) {
    var target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
      rightWrongDisplay.style.display = 'block';
      if (
        target.textContent === questions[currentQuestionIndex].correctAnswer
      ) {
        rightWrongDisplay.textContent = 'Right';
        score += 25;
      } else {
        rightWrongDisplay.textContent = 'Wrong';
        timeLeft -= 10;
      }
      setTimeout(function () {
        rightWrongDisplay.style.display = 'none';
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
          displayQuestion(currentQuestionIndex);
        } else {
          endQuiz();
        }
      }, 1000);
    }
  });
});

let countSpan = document.querySelector(".count span");
let bulletSpans = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answeredArea = document.querySelector(".answered-area");
let submitAnswer = document.querySelector(".submit-answer");
let resultsDiv = document.querySelector(".results");
let countDown = document.querySelector(".countdown");
let currentIndex = 0;
let rightAnswers = 0;
let timercount; //to stop timer

function myRequests() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let myquestionsObject = JSON.parse(this.responseText);
      let myquestionNumbers = myquestionsObject.length;
      // console.log(myquestionNumbers)
      questionNumbers(myquestionNumbers);
      questionsData(myquestionsObject[currentIndex], myquestionNumbers);
      timer(5, myquestionNumbers);
      submitAnswer.onclick = () => {
        let rightAnswer = myquestionsObject[currentIndex].right_answer;
        // console.log(rightAnswer)
        currentIndex++;
        checkAnswer(rightAnswer, myquestionNumbers);

        // to move to the next question
        quizArea.innerHTML = "";
        answeredArea.innerHTML = "";
        questionsData(myquestionsObject[currentIndex], myquestionNumbers);
        handleBullets();
        clearInterval(timercount);
        timer(5, myquestionNumbers);
        showResults(myquestionNumbers);
      };
    }
  };
  myRequest.open("GET", "question.json", true);
  myRequest.send();
}
myRequests();

function questionNumbers(num) {
  countSpan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let bullets = document.createElement("span");
    bulletSpans.appendChild(bullets);
    if (i === 0) {
      bullets.className = "on";
    }
  }
}

function questionsData(obj, count) {
  if (currentIndex < count) {
    let questionName = document.createElement("h2");
    let questionTitle = document.createTextNode(obj["title"]);
    questionName.appendChild(questionTitle);
    quizArea.appendChild(questionName);

    for (let i = 1; i <= 4; i++) {
      let answer = document.createElement("div");
      answer.className = "answer";
      let inputRadio = document.createElement("input");
      inputRadio.type = "radio";
      inputRadio.id = `answer_${i}`;
      inputRadio.name = "questions";
      inputRadio.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        inputRadio.checked = true; //to make first answer checked
      }

      let labelradio = document.createElement("label");
      labelradio.htmlFor = `answe_r${i}`;
      let labelradioText = document.createTextNode(obj[`answer_${i}`]);
      labelradio.appendChild(labelradioText);
      answer.appendChild(inputRadio);
      answer.appendChild(labelradio);
      answeredArea.appendChild(answer);
    }
  }
}

function checkAnswer(rightAnswer, questionNumbers) {
  let answers = document.getElementsByName("questions");
  let choosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rightAnswer === choosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletSpan = document.querySelectorAll(".bullets .spans span");
  let bulletArray = Array.from(bulletSpan);
  bulletArray.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let results;
  if (currentIndex === count) {
    console.log("finished");
    quizArea.remove();
    answeredArea.remove();
    submitAnswer.remove();
    bulletSpans.remove();
    if (rightAnswers > count / 2 && rightAnswers < count) {
      results = `<span class ="good">Good</span>,${rightAnswers} from ${count}`;
    } else if (rightAnswers === count) {
      results = `<span class ="perfect">Perfect</span>,${rightAnswers}`;
    } else {
      results = `<span class ="bad">Bad</span>,${rightAnswers} from ${count}`;
    }
    resultsDiv.innerHTML = results;
  }
}
function timer(duration, count) {
  if (currentIndex < count) {
    let minutes, secounds;
    timercount = setInterval(function () {
      minutes = parseInt(duration / 60);
      secounds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      secounds = secounds < 10 ? `0${secounds}` : secounds;

      countDown.innerHTML = `${minutes} : ${secounds}`;
      if (--duration < 0) {
        clearInterval(timercount);
        submitAnswer.click();
      }
    }, 1000);
  }
}

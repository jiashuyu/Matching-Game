/*
 * 创建一个包含所有卡片的数组
 */
var allCards = [
  "fa fa-diamond",
  "fa fa-paper-plane-o",
  "fa fa-anchor",
  "fa fa-bolt",
  "fa fa-cube",
  "fa fa-leaf",
  "fa fa-bicycle",
  "fa fa-bomb"
];
allCards = allCards.concat(allCards);

/*
 * 显示页面上的卡片
 *   - 使用下面提供的 "shuffle" 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
 */

var shuffledCards;
var deck;
shuffleDeck();

function shuffleDeck() {
  shuffledCards = shuffle(allCards);
  deck = document.querySelectorAll('.card');
  for (var i=0; i<shuffledCards.length; i++) {
    deck[i].firstElementChild.className = shuffledCards[i];
  }
}

// 洗牌函数来自于 http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


var totalTime = 0;
var timer;
var timingMsg = document.querySelector('.timing');

function startTimer() {
  var timer = window.setInterval(updateTimingMsg, 1000);
}

function updateTimingMsg() {
  totalTime++;
  timingMsg.textContent = totalTime;
}

function stopTimer() {
  clearInterval(timer);
  totalTime = 0;
}
/*
 * 设置一张卡片的事件监听器。 如果该卡片被点击：
 *  - 显示卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 将卡片添加到状态为 “open” 的 *数组* 中（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
 *    + 如果卡片匹配，将卡片锁定为 "open" 状态（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 增加移动计数器并将其显示在页面上（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果所有卡都匹配，则显示带有最终分数的消息（将这个功能放在你从这个函数中调用的另一个函数中）
 */
var open = [];
var stepCount = 0;
var done = false;
startTimer();


function openCard(num) {
  showSymbol(num);
  open.push(num);
  checkOpen();
}

for (var index=0; index<16; index++) {
  deck[index].addEventListener('click', openCard.bind(null, index));
}


var resetButton = document.querySelector('.restart');
resetButton.addEventListener('click', reset);

function checkOpen() {
  if (done == false) {
    if (open.length == 2) {
      var x = open[0];
      var y = open[1];
      open.pop();
      open.pop();
      if (deck[x].firstElementChild.className == deck[y].firstElementChild.className && x!==y) {
        matchFound(x, y);
      } else {
        hideCards(x, y);
      }
    }
    stepCount++;
    updateStepCount();
    checkStar();
    if (checkAllMatch() == true) {
      showFinalResults();
      finalAlertMsg();
      stopTimer();
      done = true;
    }
  } else {
    open.pop();
  }
}

function showSymbol(num) {
  deck[num].classList.add('show');
  deck[num].classList.add('open');
}

function matchFound(x, y) {
  deck[x].classList.remove('show');
  deck[x].classList.remove('open');
  deck[y].classList.remove('show');
  deck[y].classList.remove('open');
  deck[x].classList.add('match');
  deck[y].classList.add('match');
}

function hideCards(x, y) {
  window.setTimeout(function() {
    deck[x].classList.remove('show');
    deck[x].classList.remove('open');
    deck[y].classList.remove('show');
    deck[y].classList.remove('open');
  }, 400);
}

function checkAllMatch() {
  for (var i=0; i<16; i++) {
    if (deck[i].classList.contains('match') === false) {
      return false;
    } else {
      continue;
    }
  }
  return true;
}

function updateStepCount() {
  var stepCountMsg = document.querySelector('.moves');
  stepCountMsg.textContent = stepCount;
}

function showInitialTitle() {
  var heading = document.querySelector('h1');
  heading.textContent = "Matching Game";
}

function showFinalResults() {
  var heading = document.querySelector('h1');
  heading.textContent = `Click reset button if you want to play again.`;
}

function reset() {
  stopTimer();
  for (var i=0; i<16; i++) {
    if (deck[i].classList.contains('show')) {
      deck[i].classList.remove('show');
    }
    if (deck[i].classList.contains('open')) {
      deck[i].classList.remove('open');
    }
    if (deck[i].classList.contains('match')) {
      deck[i].classList.remove('match');
    }
  }
  done = false;
  stepCount = 0;
  updateStepCount();
  showInitialTitle();
  threeStar();
  shuffleDeck();
}

var stars = document.querySelector('.stars');

function oneStar() {
  stars.childNodes[1].setAttribute('style', 'display: inline-block');
  stars.childNodes[3].setAttribute('style', 'display: none');
  stars.childNodes[5].setAttribute('style', 'display: none');
}

function twoStar() {
  stars.childNodes[1].setAttribute('style', 'display: inline-block');
  stars.childNodes[3].setAttribute('style', 'display: inline-block');
  stars.childNodes[5].setAttribute('style', 'display: none');
}

function threeStar() {
  stars.childNodes[1].setAttribute('style', 'display: inline-block');
  stars.childNodes[3].setAttribute('style', 'display: inline-block');
  stars.childNodes[5].setAttribute('style', 'display: inline-block');
}

function checkStar() {
  if (stepCount <= 40) {
    threeStar();
  } else if (stepCount <= 60) {
    twoStar();
  } else {
    oneStar();
  }
}

function finalAlertMsg() {
  var text = "three stars. Awesome job!";
  if (stepCount > 40 && stepCount <= 60) {
    text = "two stars. That is not bad.";
  } else if (stepCount > 60) {
    text = "only one star. Keep playing and you will get better!";
  }
  window.alert(`Congratulations! You finish the matching game! Total step used: ${stepCount}. Total time used: ${totalTime} seconds. You got ${text} Click reset button if you want to play again.`);
}

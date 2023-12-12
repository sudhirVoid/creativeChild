const myAPI = 'https://opentdb.com/api.php?amount=49&category=18';
var countQuestions = 0;
var apiResponse;
var counter = 0;

// question dom elements:
var question = document.getElementById('questionText');
var finalScore = document.getElementById('finalScore');

// options dom
var option1 = document.getElementById('optionLabel1');
var option2 = document.getElementById('optionLabel2');
var option3 = document.getElementById('optionLabel3');
var option4 = document.getElementById('optionLabel4');

// var backBtn = document.getElementById('backBtn');
var nextBtn = document.getElementById('nextBtn');
var questionSolved = document.getElementById('noOfQuestionSolvedTracker')
var userAnswers = {};

// event listners for radio button
// option1.addEventListener('click',optionHandler);
// function optionHandler(){
//     console.log(this.value)
// }

finalScore.style.display = 'none';
// document.addEventListener('DOMContentLoaded', function() {

// });
function userSelectionUpdater(selectedText){
    userAnswers[counter] = {
        selected: selectedText,
        isTrue: true ? apiResponse[counter].correct_answer === selectedText : false
    }

}
function radioClicked(selectedOption){

    switch (selectedOption) {
        case 'optionLabel1':
            console.log('Label 1 selected' + option1.innerText);
            userSelectionUpdater(option1.innerText);

            break;
        case 'optionLabel2':
            console.log('lable 2 ');
            userSelectionUpdater(option2.innerText);
            break;
        case 'optionLabel3':
            console.log('Label 3 Selected');
            userSelectionUpdater(option3.innerText);
            break;
        case 'optionLabel4':
            console.log('Label 4 selected');
            userSelectionUpdater(option4.innerText);
            break;
    
        default:
            alert('This is on Us. Got an error')
            break;
    }
}
// backBtn.addEventListener('click',backPressHandler);
nextBtn.addEventListener('click', nextPressHandler);

// when back button is clicked.
// function backPressHandler(){
//     if(counter>0){
//         counter = counter - 1;
//         populateQuestion();
//     }
//     else{
//         alert('This is the first Question')
//     }
// }
function scoreCounter(){
    return Object.values(userAnswers).filter(answer => answer.isTrue).length;
}
// when next button is clicked.
function nextPressHandler(){
    
    if(counter<apiResponse.length-1){
        counter = counter + 1;
        populateQuestion();
    }
    else if(counter>=apiResponse.length-1){
        var questionCard = document.getElementById('questionCardId');
        questionCard.style.display = 'none';

        finalScore.style.display = 'flex';
        finalScore.style.justifyContent = 'center';
        finalScore.style.alignItems = 'center';
        let score = scoreCounter();
        switch (scoreCounter) {
            case scoreCounter<10:
                document.getElementById('scoreParagraph').innerText = `Score: ${scoreCounter()}`
                document.getElementById('scoreEmoji').innerText = ` 😭`
                break;
            case scoreCounter <20:
                document.getElementById('scoreParagraph').innerText = `Score: ${scoreCounter()}`
                document.getElementById('scoreEmoji').innerText = ` 😕`
                break;
            case scoreCounter <30:
                document.getElementById('scoreParagraph').innerText = `Score: ${scoreCounter()}`
                document.getElementById('scoreEmoji').innerText = ` 😐`
        
            default:
                document.getElementById('scoreParagraph').innerText = `Score: ${scoreCounter()} `
                document.getElementById('scoreEmoji').innerText = ` 🙂`
                break;
        }
        

    }
    questionSolved.innerText = ` ${counter+1}/${apiResponse.length.toString()}`
    let ele = document.getElementsByName("options");
    for(var i=0;i<ele.length;i++)
    ele[i].checked = false;
    
}
var optionThirdElement = document.getElementById('option3');
var optionFourElement = document.getElementById('option4');
// function to change question DOM
function populateQuestion(){
    question.innerHTML = apiResponse[counter].question;
    let correctAnswer = apiResponse[counter].correct_answer;

    let randOptionArray = [correctAnswer, ...apiResponse[counter].incorrect_answers];
    randOptionArray = shuffleArray(randOptionArray);

    console.log(randOptionArray);

    option1.innerHTML = randOptionArray[0]
    option2.innerHTML = randOptionArray[1]
    // for 3rd option
    if(randOptionArray[2]){
        optionThirdElement.style.display = 'block';
        option3.style.display = 'block'
        option3.innerHTML = randOptionArray[2]
    }
    else{
        optionThirdElement.style.display = 'none';
        option3.style.display = 'none'
        option4.innerHTML = randOptionArray[3]
    }
    // for 4th option
    if(randOptionArray[3]){
        option4.innerHTML = randOptionArray[3]
        optionFourElement.style.display = 'block';
        option4.style.display = 'block'
    }
    else{
        optionFourElement.style.display = 'none';
        option4.style.display = 'none'
        
    }
    
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function fetchQuizData(callback){

    let myPromise = new Promise((resolve, reject)=>{
        fetch(myAPI)
        .then(response =>{
            if(response.ok){
                return response.json();
            }
            else{
                throw new Error("HTTP ERROR");
            }
        })
        .then(response =>{
            console.log("Successfully loaded the data.");
            resolve(response)
        })
        .catch(reason =>{
            console.log("This error is on Us.")
            reject(reason)
        })
    });
    myPromise.then(res =>{
        // process this object to show question, no of questions solved, etc.
        console.log("Inside promise")
        console.log(res);
        apiResponse = res.results;
        console.log('Length is' + apiResponse.length)
        questionSolved.innerText = ` ${counter+1}/${apiResponse.length.toString()}`
        callback();
    }).catch(err=>{
        console.log(err);
    })
    
}


fetchQuizData(populateQuestion);




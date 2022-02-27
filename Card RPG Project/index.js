import characterData from './data.js'
import Character from './Character.js'
import DeckCard from './deckCard.js'

let monstersArray = ["heroWarrior","imp","darkLord","behemoth","demon","evilGod", "chimera", "fury", "earthKing","galefire","darkKnight","whiteDragon","wizard","yanflayer","goblin", "blueDragon", "orc"];

//DOM Elements
const cardDeck1 = document.querySelectorAll('.user1');
const cardDeck2 = document.querySelectorAll('.user2');

const drawBtn1 = document.getElementById('draw1');
const drawBtn2 = document.getElementById('draw2');
const attackBtn = document.getElementById("attack-button");
let addCardBtn1 = document.getElementById('add-card-btn1');
let addCardBtn2 = document.getElementById('add-card-btn2');

let hero = document.getElementById('hero');
let monster = document.getElementById('monster');

let card1 = {};
let card2 = {};

let cardIndex1 = null;
let cardIndex2 = null;

let currentDeck1Card = null;
let currentDeck2Card = null;
let cardsOnfield = 0;
let deck1Cards = 0;
let deck2Cards = 0;

//Booleans
let user1Turn = true;
let user2Turn = false;

let cardDeck1Full = false;
let cardDeck2Full = false;
let isWaiting = false;

function generateDeck(deck){
    for(let i = 0; i < deck.length; i++)
    {   
        const randomNum = Math.floor(Math.random() * 11);
        deck[i].addEventListener('click', ()=>selectCard(i, deck[i],randomNum));
        generateCard(deck,i,randomNum);
    }
}

function removeCardFromDeck(deck)
{
    deck.innerHTML = '';
    deck.classList.remove('selected');
}

function generateCard(deck,index,randomNum)
{
    deck[index].innerHTML = new 
    DeckCard(characterData[monstersArray[index+randomNum]]).getDeckCardHtml();
}

function drawDeck(deck){
    if (deck === cardDeck1 && !cardDeck1Full)
    {
        generateDeck(deck);
        deck1Cards = 6;
        cardDeck1Full = true;
        drawBtn1.classList.add('unactive');
    }else if (deck === cardDeck2 && !cardDeck2Full) {
        generateDeck(deck);
        deck2Cards = 6;
        cardDeck2Full = true;
        drawBtn2.classList.add('unactive');
    }
}

function render(html,card) {  
    if (html.classList.contains('empty'))
        html.classList.remove('empty')
        
    html.innerHTML = card.getCharacterHtml() 
}

function updateCards()
{
    hero.innerHTML = card1.getCharacterHtml()
    monster.innerHTML = card2.getCharacterHtml()
}

function selectCard(index,deckCard,randomNum)
{
    if(!deckCard.classList.contains('selected'))
    {
        deckCard.classList.add('selected')
        if (deckCard.classList.contains('user1') && !user2Turn && user1Turn)
        {
            user1Turn = true;
            user2Turn = false;
            if(addCardBtn1)
            {
                addCardBtn1.classList.remove('unactive');
                cardIndex1 = index+randomNum;
                currentDeck1Card = deckCard;
            }      
        }
            
        else if (deckCard.classList.contains('user2') && !user1Turn && user2Turn)
        {
            user2Turn = true;
            user1Turn = false;
            if (addCardBtn2)
            {
                addCardBtn2.classList.remove('unactive');
                cardIndex2 = index + randomNum;
                currentDeck2Card = deckCard;
            }
        }         
    }
         
    else {
        deckCard.classList.remove('selected')
        if (deckCard.classList.contains('user1'))
        {
             addCardBtn1.classList.add('unactive');
             cardIndex1 = null;
             currentDeck1Card = null;
        }
           
        else if (deckCard.classList.contains('user2'))
        {
            addCardBtn2.classList.add('unactive');
            cardIndex2 = null;
            currentDeck2Card = null;
        }       
    }        
}

function drawCard(index,deckCard) {
    
    if(index != null && monstersArray.length !== 0 && cardsOnfield < 2){
        
        if (cardsOnfield < 2 && !attackBtn.classList.contains('hide'))
            attackBtn.classList.add('hide')
    
        if (user1Turn && !user2Turn)
        {
            card1 = getMonster(index);
            render(hero, card1);
            //attackBtn.classList.remove('hide');
            cardsOnfield++;
            removeCardFromDeck(deckCard);
            user1Turn = false;
            user2Turn = true;
        }else if(user2Turn && !user1Turn){
            card2 = getMonster(index);
            render(monster, card2);
            attackBtn.classList.remove('hide');
            cardsOnfield++;
            removeCardFromDeck(deckCard);
            user2Turn = false;
            user1Turn = true;
        }
    
        if (cardsOnfield === 2)
            attackBtn.classList.remove('hide')
    }
}

function getMonster(index){
    const nextMonsterData = characterData[monstersArray[index]]
    return nextMonsterData ? new Character(nextMonsterData) : {}
}

function getNewMonster() {
    //const nextMonsterData = characterData[monstersArray.shift()]
    const index = Math.floor(Math.random() * monstersArray.length)
    const nextMonsterData = characterData[monstersArray[index]]
    return nextMonsterData ? new Character(nextMonsterData) : {}
}

function attack() {
    if(!isWaiting){
        card1.setDiceHtml()
        card2.setDiceHtml()
        card1.takeDamage(card2.currentDiceScore)
        card2.takeDamage(card1.currentDiceScore)
        updateCards()
        
        if (card1.dead && card2.dead){
                cardIndex1 = null;
                cardIndex2 = null;
                user1Turn = true;
                user2Turn = false;
                isWaiting = true
                
                if(deck1Cards > 0)
                    deck1Cards--;
                
                if(deck2Cards > 0)
                    deck2Cards--;
                
                cardsOnfield = 0;
                if(monstersArray.length > 0){
                setTimeout(()=>{
                    hero.innerHTML = ''
                    hero.classList.add('empty')
                    monster.innerHTML = '';
                    monster.classList.add('empty')
                    
                    attackBtn.classList.add('hide')
                    cardsOnfield--;
                    isWaiting = false
                    
                    /*if (drawBtn2.classList.contains('hide'))
                        drawBtn2.classList.remove('hide')*/
                    addCardButton(hero);    
                    addCardButton(monster);
                    
                    endGame();
                        
                },1500)

                
            }
        }
        
        else if(card1.dead){
            isWaiting = true
            cardIndex1 = null;
            user1Turn = true;
            user2Turn = false;
            
            if(deck1Cards > 0)
                    deck1Cards--;
            
            if(monstersArray.length > 0){
                attackBtn.classList.add('hide')
                setTimeout(()=>{
                    hero.innerHTML = '';
                    hero.classList.add('empty')
                    addCardButton(hero);
                    user1Turn = true;
                    cardsOnfield--;
                    isWaiting = false
                    
                    /*if (drawBtn1.classList.contains('hide'))
                        drawBtn1.classList.remove('hide')*/
                    endGame();
                        
                },1500)
                
                
            }
        }
        else if(card2.dead){
            isWaiting = true
            cardIndex2 = null;
            
            user2Turn = true;
            user1Turn = false;
            
            if(deck2Cards > 0)
                    deck2Cards--;
            
            if(monstersArray.length > 0){
                setTimeout(()=>{
                    monster.innerHTML = '';
                    monster.classList.add('empty')
                    attackBtn.classList.add('hide')
                    user1Turn = false;
                    cardsOnfield--;
                    isWaiting = false
                    
                    /*if (drawBtn2.classList.contains('hide'))
                        drawBtn2.classList.remove('hide')*/
                        
                    addCardButton(monster);
                    endGame();    
                },1500)
                
            }
        }    
    }
}

function endGame(deck) {
    
    console.log('END?')
    if (deck1Cards === 0 && deck2Cards === 0)
    {
        //DRAW
        console.log('DRAW!')   
    }else if (deck1Cards === 0)
    {
        //USER 2 WIN
        console.log('USER 2 WON!')
        addCardBtn1 = null;
        hero.innerHTML = `<img class="avatar" src="./images/skull.png" />`;
        hero.classList.add('empty');
        
    }else if (deck2Cards === 0)
    {
        //USER 1 WIN
        console.log('USER 1 WON!')
        addCardBtn2 = null;
        monster.innerHTML = `<img class="avatar" src="./images/skull.png" />`;
        monster.classList.add('empty');
    }
    
    //isWaiting = true
    /*const endMessage = card1.health === 0 && card2.health === 0 ?
        "No victors - all creatures are dead" :
        card1.health > 0 ? "The Wizard Wins" :
            "The monsters are Victorious"

    const endEmoji = card1.health > 0 ? "🔮" : "☠️"
        setTimeout(()=>{
            document.body.innerHTML = `
                <div class="end-game">
                    <h2>Game Over</h2> 
                    <h3>${endMessage}</h3>
                    <p class="end-emoji">${endEmoji}</p>
                </div>
                `
        }, 1500)*/
}

function addCardButton(html)
{
    if (html === hero)
    {
        html.innerHTML = `<button id='add-card-btn1' class="addCard unactive">Choose</button>`;
        addCardBtn1 = document.getElementById('add-card-btn1');
        addCardBtn1.addEventListener('click', ()=>drawCard(cardIndex1, currentDeck1Card));
    }
    else if (html === monster)
    {
        html.innerHTML = `<button id='add-card-btn2' class="addCard unactive">Choose</button>`;
        addCardBtn2 = document.getElementById('add-card-btn2');
        addCardBtn2.addEventListener('click', ()=>drawCard(cardIndex2, currentDeck2Card)); 
    }
    
}

//Event Listeners
attackBtn.addEventListener('click', attack)
drawBtn1.addEventListener('click', ()=>drawDeck(cardDeck1))
drawBtn2.addEventListener('click', ()=>drawDeck(cardDeck2))
addCardBtn1.addEventListener('click', ()=>drawCard(cardIndex1, currentDeck1Card))
addCardBtn2.addEventListener('click', ()=>drawCard(cardIndex2, currentDeck2Card))




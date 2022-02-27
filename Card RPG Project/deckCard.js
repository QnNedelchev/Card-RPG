class DeckCard {
    constructor(data){
        Object.assign(this, data);
        
    }
    
    getDeckCardHtml() {
        const {name, avatar, health, diceCount} = this
        return `
            <div class="character-card-small">
                <h4 class="name-small"> ${name} </h4>
                <img class="avatar-small" src="${avatar}" />
                <div class="health-small">health: <b> ${health} </b></div>
                <div class="dice-count-small">dices: <b>${diceCount}</b></div>
            </div>`
    }
}

export default DeckCard
jQuery.fn.addEvent = function (type, listener, useCapture) {
    var self = this.get(0);
    if (self.addEventListener) {
        self.addEventListener(type, listener, useCapture);
    } else if (self.attachEvent) {
        self.attachEvent('on' + type, listener);
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function findParentByElClassLvl(element, str, lvl) {
    let el = element
    for (let i = 0; i < lvl; i++) {
        if ($(el).parent(str)[0]) {
            console.log($(el).parent(str)[0])
            return $(el).parent(str)[0]
        } else {
            el = el.parentNode
        }
    }
    return false
}

function getShuffledArray(arr) {
    let result = arr

    return result.sort(() => Math.random() - 0.5)
}


function Game(params) {
    this.emojis = params.emojis
    this.countCards = params.countCards
    this.mountEl = params.mountEl
    this.renderField()
}

Game.prototype.makeEmojisMap = function () {
    let ems = getShuffledArray(this.emojis)
    let emMap = []
    ems.forEach(el => {
        emMap.push(el)
        emMap.push(el)
    })
    emMap = emMap.slice(0, 12)
    emMap = getShuffledArray(emMap)
    return emMap
}

Game.prototype.renderField = function () {
    let emMap = this.makeEmojisMap()
    this.cardsArr = []
    for (let i = 0; i <= this.countCards; i++) {
        let card = new Card({id: i, emoji: emMap[i], mountEl: this.mountEl})
        this.cardsArr.push(card)
        console.log(card)
    }

}
Game.prototype.handler = function (event) {
    if (event.target.className === 'card_back') {
        event.target.parentElement.classList.add('rotateY180')
    } else if (event.target.className === 'card_front') {
        event.target.parentElement.classList. remove('rotateY180')
    }
}


function Card(params) {
    this.mountEl = params.mountEl
    this.emoji = params.emoji
    this.id = params.id
    this.element = this.renderCard()

}

Card.prototype.renderCard = function () {
    let card = document.createElement('article')
    card.className = 'field__card'
    card.id = this.id


    let card_front = document.createElement('div')
    card_front.className = 'card_front'
    card_front.innerHTML = this.emoji
    card.appendChild(card_front)

    let card_back = document.createElement('div')
    card_back.className = "card_back"
    card.appendChild(card_back)


    $(this.mountEl).append(card)

    return card
}


var game = new Game({
    emojis: [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🐻', '🐼',
        '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐙',
        '🐵', '🦄', '🐞', '🦀', '🐟', '🐊', '🐓',
        '🦃', '🐿'
    ], countCards: 11, mountEl: '.field',
})
$(game.mountEl)[0].addEventListener('click', game.handler, true)





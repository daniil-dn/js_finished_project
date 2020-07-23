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
    card.appendChild(card_front)

    let card_back = document.createElement('div')
    card_back.className = "card_back"
    card.appendChild(card_back)

    let card_emoji = document.createElement('div')
    card_emoji.className = 'card_emoji'
    card_emoji.innerHTML = this.emoji
    card_front.appendChild(card_emoji)
    $(this.mountEl).append(card)

    return card
}


var g = new Game({
    emojis: [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🐻', '🐼',
        '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐙',
        '🐵', '🦄', '🐞', '🦀', '🐟', '🐊', '🐓',
        '🦃', '🐿'
    ], countCards: 11, mountEl: '.field',
})
g.renderField()


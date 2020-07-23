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
    this.cards = this.renderField()

}

Game.prototype.makeEmojisMap = function () {
    let ems = getShuffledArray(this.emojis)
    let emMap = []
    ems.forEach(el => {
        emMap.push(el)
        emMap.push(el)
    })
    emMap = emMap.slice(0, this.countCards)
    emMap = getShuffledArray(emMap)
    return emMap
}
Game.prototype.renderField = function () {
    let emojisMap = this.makeEmojisMap()
    let cardsArr = emojisMap.map((current, id) => {
        return new Card({id: id.toString(), emoji: current, mountEl: this.mountEl})
    })

    return cardsArr
}
Game.prototype.handler = function (event, thisElem) {
    if (event.target.tagName !== 'SECTION') {

        let card = this.cards.find((el) => {
            return el.id === event.target.parentElement.id
        })

        card.flip()
        let pairStatus = this.checkPair(card)
        if (pairStatus) {
            card.tagAsRight()
        } else if (pairStatus === false) {
            card.tagAsWrong
        } else if (pairStatus === undefined) {
            card.resetExPairStatus()
        }

        // console.log(card)
    }
}
Game.prototype.checkPair = function (card) {
    let pairCard = this.cards.find(element => {
        if (element.id === card.id) {
            return false
        } else {
            return element.emoji === card.emoji
        }
    })
    console.log("pair" + pairCard)
    if (pairCard.isFlipped()) {
        card.tagAsRight()
        pairCard.tagAsRight()
    }
}

function Card(params) {
    this.mountEl = params.mountEl
    this.emoji = params.emoji
    this.id = params.id
    this.DOMElement = this.renderCard()


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
Card.prototype.flip = function () {

    this.DOMElement.classList.toggle('flipped')
}

Card.prototype.tagAsRight = function () {
    this.DOMElement.children[0].classList.add('greenBg')
    this.DOMElement.classList.add('rightPair')
    this.flip = () => { true}
}
Card.prototype.tagAsWrong = function () {
    this.DOMElement.children[0].classList.toggle('redBg')
}
Card.prototype.isFlipped = function () {
    if (this.DOMElement.classList.contains('flipped')) {
        return true
    } else {
        return false
    }
}

Card.prototype.resetExPairStatus = function () {

}
game = new Game({
    emojis: [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🐻', '🐼',
        '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐙',
        '🐵', '🦄', '🐞', '🦀', '🐟', '🐊', '🐓',
        '🦃', '🐿'
    ], countCards: 12, mountEl: '.field',
})
$(game.mountEl)[0].addEventListener('click', (event) => {
    game.handler(event, this)
}, true)





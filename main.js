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
        return new Card({id: id.toString(), emoji: current, mountEl: this.mountEl, game: this})
    })

    return cardsArr
}
Game.prototype.handler = function (event, thisElem) {
    if (event.target.tagName !== 'SECTION') {

        let card = this.cards.find((el) => {
            return el.id === event.target.parentElement.id
        })

        card.flip()
        let pairStatus = this.checkPair(card)//+
        if (pairStatus.state === true) {
            card.tagAsRight()
            pairStatus.pair.tagAsRight()//+
        } else if (pairStatus.state === 'lonecard') {
            return undefined
        } else if (pairStatus.state === 'two_dif_cards') {
            card.toggleWrong()
            pairStatus.flippedCard.toggleWrong()
            console.log(pairStatus)
        }else if (pairStatus.state === 'reset'){
            this.resetExPairStatus(pairStatus.flippedCard, pairStatus.flippedCard2)
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
    console.log('-pair card')
    console.log(pairCard)
    let flippedCard = this.cards.find(element => {
        if (element.id === card.id || element.id === pairCard.id) {
            return false
        } else {
            if (element.isFlipped()) {
                return true
            }
        }
    })
    console.log('-flipped card')
    console.log(flippedCard)
    let flippedCard2 = undefined
    if (flippedCard !== undefined) {
        flippedCard2 = this.cards.find(element => {
            if (element.id === card.id || element.id === flippedCard.id) {
                return false
            } else {
                if (element.isFlipped()) {
                    return true
                }
            }
        });
        console.log('-flipped card 2')
        console.log(flippedCard2)
    }

    if (pairCard.isFlipped()  && flippedCard2 == undefined) {
        console.log('pairCard is flipped')
        console.log('---------------------')
        return {state: true, pair: pairCard}
    } else if (flippedCard === undefined && flippedCard2 === undefined) {
        console.log('alone card')
        console.log('---------------------')
        return {state: 'lonecard'}
    } else if (flippedCard !== undefined && flippedCard2 === undefined) {
        console.log('two_dif_cards')
        console.log('---------------------')
        return {state: 'two_dif_cards', flippedCard: flippedCard}
    }else if(flippedCard2 !== undefined ){
        console.log('reset')
        console.log('---------------------')
        return {state: 'reset', flippedCard: flippedCard, flippedCard2: flippedCard2}
    }

}
Game.prototype.resetExPairStatus = function (otherCard, otherCard2) {
    otherCard.flip()
    otherCard.toggleWrong()

    otherCard2.flip()
    otherCard2.toggleWrong()
}


function Card(params) {
    this.mountEl = params.mountEl
    this.emoji = params.emoji
    this.id = params.id
    this.DOMElement = this.renderCard()
this.game = params.game

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
    game.cards = game.cards.filter(value => {return value !== this})
    this.flip = () => {
        true
    }
}
Card.prototype.toggleWrong = function () {
    if (this.DOMElement.children[0].classList.contains('redBg')) {
        this.DOMElement.children[0].classList.toggle('redBg')
    } else {
        this.DOMElement.children[0].classList.add('redBg')
    }
}
Card.prototype.isFlipped = function () {
    if (this.DOMElement.classList.contains('flipped')) {
        return true
    } else {
        return false
    }
}

Card.prototype.isWrong = function () {
    if (this.DOMElement.classList.contains('redBg')) {
        return true
    } else {
        return false
    }
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





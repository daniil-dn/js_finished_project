jQuery.fn.addEvent = function (type, listener, useCapture) {
    var self = this.get(0);
    if (self.addEventListener) {
        self.addEventListener(type, listener, useCapture);
    } else if (self.attachEvent) {
        self.attachEvent('on' + type, listener);
    }
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
    this.clickcounter = 0

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
    if (this.clickcounter === 0) {
        this.clickcounter = 1
        var timer = setInterval(function (th) {
            return () => th.gameTime()
        }(this), 1000)

        setTimeout(() => {
            clearInterval(timer);
            loseGame()
        }, 60000)
    }

    if (event.target.tagName !== 'SECTION') {
        let card = this.cards.find((el) => {
            return el.id === event.target.parentElement.id
        })
        if (!card.isWrong()) {
            this.resetWrong()
            card.flip()

            this.checkPair(card)
        }
    }
}
Game.prototype.resetWrong = function () {
    let wrongCards = this.cards.filter(card => {
        return card.isWrong()
    })
        .forEach(card => {
            card.toggleWrong();
            card.flip()
        })
}
Game.prototype.checkPair = function () {
    let otherCards = this.cards.map((cur, index, array) => {
        if (cur.isFlipped()) {
            return cur
        }
    })
    otherCards = otherCards.filter(card => card !== undefined && !card.isWrong())
    console.log(otherCards)

    if (otherCards.length < 2) {// one card on the field
        return;
    } else if (otherCards[0].emoji === otherCards[1].emoji) {
        otherCards[0].tagAsRight()
        otherCards[1].tagAsRight()
    } else if (otherCards[0].emoji !== otherCards[1].emoji) {
        otherCards[0].toggleWrong()
        otherCards[1].toggleWrong()
    } else if (otherCards.length > 2) {
        return {state: 'reset', flippedCards: otherCards}
    }

}


Game.prototype.gameTime = function () {
    let curTimer = 1
    console.log(this)
    $('.timer ')[0].innerText = this.secToMins(curTimer)
    curTimer += 1
}
Game.prototype.secToMins = function (sec) {
    let res = ''
    let mins = sec / 60
    console.log(mins, sec)
    mins = Math.floor(mins)
    console.log(mins, sec)
    sec = sec - 60 * mins

    if (mins < 10) {
        res = '0' + mins + ':'
    } else {
        res = mins + ':'
    }
    if (sec < 10) {
        res = res + '0' + sec
    } else {
        res = res + sec
    }

    return res
}
Game.prototype.loseGame = function () {

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
    game.cards = game.cards.filter(value => {
        return value !== this
    })
    this.flip = () => {
        true
    }
}
Card.prototype.toggleWrong = function () {
    if (this.DOMElement.children[0].classList.contains('redBg')) {
        this.DOMElement.children[0].classList.toggle('redBg')
        this.DOMElement.classList.toggle('wrongPair')
    } else {
        this.DOMElement.children[0].classList.add('redBg')
        this.DOMElement.classList.add('wrongPair')
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
    if (this.DOMElement.classList.contains('wrongPair')) {
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





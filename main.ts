input.onButtonPressed(Button.B, function () {
    dokk1.stopDataCollection()
    collectingData = 0
})
input.onButtonPressed(Button.A, function () {
    dokk1.startDataCollection()
    collectingData += 1
})
let collectingData = 0
basic.showLeds(`
    . . . . .
    . . . . .
    # . # . #
    . . . . .
    . . . . .
    `)
dokk1.initialize()
basic.forever(function () {
    // let newMessage = serial.readString();
    // basic.showString(newMessage, 50);
    dokk1.listenForMessages()
    if (collectingData) {
        basic.showLeds(`
            . . . . .
            . . . . .
            # . . . .
            . . . . .
            . . . . .
            `)
        basic.pause(100)
        basic.showLeds(`
            . . . . .
            . . . . .
            . . # . .
            . . . . .
            . . . . .
            `)
        basic.pause(100)
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . #
            . . . . .
            . . . . .
            `)
        basic.pause(100)
    } else if (dokk1.checkGPSSignal() && !(collectingData)) {
        basic.showIcon(IconNames.Happy)
    } else {
        basic.showIcon(IconNames.No)
    }
})

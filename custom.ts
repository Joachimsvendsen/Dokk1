
/**
 * Custom Blocks for communicating with the DataDemocracy Expansion Board
 */

enum DataPoints {
    //% block="id"
    ID,
    //% block="latitude"
    Latitude,
    //% block="longitude"
    Longitude,
    //% block="time"
    Time,
    //% block="hello"
    Hello
}


/**
 * Custom blocks
 */
//% weight=100 color=#202020 icon="" block="DOKK1 Blocks"
namespace dokk1 {

    let boardID = "";
    let lastLat = "";
    let lastLon = "";
    let lastTime = "";

    let hasGPSSignal = false;

    //% block="Initialize System"
    export function initialize(): void {
        serial.redirect(
            SerialPin.P1,
            SerialPin.P0,
            BaudRate.BaudRate115200
        )
    }

    //% block="Start Data Collection"
    export function startDataCollection(): void {
        serial.writeLine("M_ACTI:1");
    }

    //% block="Stop Data Collection"
    export function stopDataCollection(): void {
        serial.writeLine("M_ACTI:0");
    }

    //% block="Board has GPS Signal"
    export function checkGPSSignal(): boolean {
        return hasGPSSignal;
    }


    //% block="Listen for Messages from Board"
    export function listenForMessages(): void {
        let newMessage = serial.readString();

        let messageType = newMessage.substr(0, 6)
        let messageContent = newMessage.substr(7, newMessage.length)

        switch (messageType) {
            case "M_WAKE":
                serial.writeLine("M_REDY:1")
                break;
            case "M_IDNO":
                boardID = messageContent;
                break;
            case "M_GPSO":
                if (messageContent == "0") {
                    hasGPSSignal = false;
                } else if (messageContent == "1") {
                    hasGPSSignal = true;
                }
                break;
            case "M_GPSD":
                lastLat = messageContent.substr(0, 6);
                lastLon = messageContent.substr(7, messageContent.length);
                break;
            case "M_TIMD":
                lastTime = messageContent;
                break;
            default:
        }
    }

    //% block="Send Message to Board"
    export function sendMessageToBoard(message: DataPoints): void {
        basic.showString(message.toString(), 100);
        switch (message) {
            case DataPoints.ID:
                serial.writeLine(boardID);
                break;
            case DataPoints.Latitude:
                serial.writeLine(lastLat);
                break;
            case DataPoints.Longitude:
                serial.writeLine(lastLon);
                break;
            case DataPoints.Time:
                serial.writeLine(lastTime);
                break;
            case DataPoints.Hello:
                serial.writeLine("M_HELL:1");
                break;
        }
    }

    //% block="Send Test Message to Board"
    export function sendTestMessageToBoard(): void {
        serial.writeLine("TEST")
    }

    //% block="Print Board Data"
    export function printData(): void {
        basic.showString("ID: " + boardID, 100);
        basic.showString("GPS: " + lastLat + ", " + lastLon, 100);
        basic.showString("TIME:" + lastTime, 100);
    }


}

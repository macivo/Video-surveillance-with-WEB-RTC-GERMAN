/*
 * Project 1 (BTI3301) 21, Berner Fachhochschule
 * Developers Gruppe 15 : Mohammed Ali, Mac Müller
 * Advisor: Stefan Cotting, Triviso AG
 */
let data = {};

export default {
    // Set status with device-name if a cam is live
    setLive: function (value) {
        data.isLive = value;
    },
    // If a com is live, return device-name
    isLive: function (){
        return data.isLive ? data.isLive : null;
    },
    // temporary saving the entered password
    setPassword: function (password){
        data.password = password;
    },
    // return the saved temporary entered pa
    getPassword: function (){
        return data.password ? data.password : null;
    },
    // temporary saving a device-name
    setDeviceName(deviceName) {
        data.deviceName = deviceName;
    },
    // return temporary saved device-name
    getDeviceName(){
        return data.deviceName ? data.deviceName : null;
    },
    // temporary saving an error of login
    loginError(value) {
        data.loginError = value;
    },
    // return temporary saved login status
    isLoginError: function (){
        return data.loginError ? data.loginError : null;
    },
    // temporary saving a status of camera
    setCam(value) {
        data.isCam = value;
    },
    // return temporary of camera
    isCam(value){
        return data.isCam ? data.isCam : null;
    }
}
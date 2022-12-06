/*
 * Project 1 (BTI3301) 21, Berner Fachhochschule
 * Developers Gruppe 15 : Mohammed Ali, Mac Müller
 * Advisor: Stefan Cotting, Triviso AG
 *
 * Component:   Generating html elements for homepage
 * Homepage:    Before the connection, user has to give a device name and password in the formular
 *              device name is very importance to identify the established connection.
 */
import service from "../service.js"
import data from "../data.js";
import router from "../router.js";

/**
 * Generating html elements for homepage
 * @param $comp template from index.html
 */
function renderLogin($comp) {
    const deviceName = document.forms[0].deviceName.value;
    const password = document.forms[0].password.value;
    //Checking devicename and password are entered
    if(!deviceName || !password){
        $('.errorLabel').text('Geben Sie einen Gerätenamen und das Password ein!');
    } else {
        if(!data.isLive()) {
            const callback = function (login){
                if(login === 'accepted'){
                    $('.errorLabel').text('Login erfolg!')
                    $('main').empty().append(service.getLocalVideo());
                } else {
                    $('.errorLabel').text('Falsches Password!');
                }
            };
            service.init(deviceName, true, password, callback);
        } else {
            data.setPassword(password);
            data.setDeviceName(deviceName);
            router.go('/live');
        }
    }
}

/**
 *  Public interface
 **/
export default {
    getTitle: function () {
        return "Home";
    },
    render: function () {
        service.checkStatus();
        const $comp = $($('#tpl-home').html());
        $('[data-action=start]', $comp).click(function (e) {
            $('.errorLabel').text('');
            renderLogin($comp);
            e.preventDefault();
        });
        return $comp;
    }
}
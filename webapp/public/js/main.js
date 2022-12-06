/*
 * Project 1 (BTI3301) 21, Berner Fachhochschule
 * Developers Gruppe 15 : Mohammed Ali, Mac Müller
 * Advisor: Stefan Cotting, Triviso AG
 *
 * main.js
 *  - List of JavaScript templates
 *  - List of router registrations
 *  - List of Navigator links
 *  - first page to go is home == router.go('/home');
 */

import router from "./router.js"
import home from "./templates/home.js"
import goLive from "./templates/live.js"

router.register("/home", home)
router.register("/live", goLive)

$('#home').on('click',function (){
    navi('/home');
    location.reload(); // must
});

/**
 * Function: Helper. If navigation was selected, then close the navigation menu
 * @param page to go
 */
function navi(page){
    router.go(page)
    $('.navi').removeAttr('open')
}

/**
 * Go Home page
 */
router.go('/home');


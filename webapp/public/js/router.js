/*
 * Project 1 (BTI3301) 21, Berner Fachhochschule
 * Developers Gruppe 15 : Mohammed Ali, Mac Müller
 * Advisor: Stefan Cotting, Triviso AG
 *
 * Router:  controls the navigation of page and requests all html elements from a component (templates)
 *          main element of homepage(index.html) will be replaced from a selected component
 */

const routes = Object.create(null);
const $main = $('main');

/**
 * main element of index.html will be replace by a view
 * @param $view
 */
function setView($view) {
    $main.fadeOut(150, function(){ $main.empty().append($view).fadeIn(300); });
}

/**
 * get a view from a template
 */
function render() {
    const hash = decodeURI(location.hash).replace('#/', '').split('/');
    const path = '/' + (hash[0] || '');
    if(!routes[path]) {
        setView($("<h2>404 Not Found</h2><p>Sorry, page not found!</p>"));
        return;
    }
    const component = routes[path];
    const param = hash.length > 1 ? hash[1] : '';
    const $view = component.render(param);
    setView($view);
    document.title = "RMS: " + (component.getTitle ? " " + component.getTitle() : " ");
} $(window).on('hashchange', render)

/**
 * Public interface
 * */
export default {
    register: function (path, component) {
        routes[path] = component;
    },
    go: function(path, param) {
        path += param ? '/' + param : '';
        if (location.hash !== '#' + path) {
            location.hash = path;
        } else {
            render();
        }
    }
};
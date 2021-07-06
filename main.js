'use strict';

document.addEventListener('DOMContentLoaded', function loaded() {

    var close = document.querySelector('.close-btn');
    var burger = document.querySelector('.burger');
    var aside = document.querySelector('aside');


    close.addEventListener('click', function onClickCloseMenu(e) {

        if (!/hidden/gi.test(aside.className)) {
            aside.className += ' hidden';

        }

        setTimeout(function () {

            burger.className.baseVal = burger.className.baseVal.replace(/hidden/, '');
        }, 300);
    });

    burger.addEventListener('click', function onClickOpenMenu(e) {

        if (/hidden/gi.test(aside.className)) {
            aside.className = aside.className.replace(/hidden/, '');
            burger.className.baseVal += 'hidden';
        }
    });
});
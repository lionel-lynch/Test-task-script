;(function() {

    // --- навигация по страничке из оглавления ---
    const headerNav = document.querySelector('.table-of-contents__list');

    // в data-атрибуте у пункта навигации храним название секции, и по клику из этого объекта будем брать секцию, к которой надо проскроллить
    const sectionsMap = {
        'about-script': document.querySelector('.about-script'),
        'realisation': document.querySelector('.realisation'),
        'script-use': document.querySelector('.script-use'),
    };

    const pageNavigate = (evt) => {
        const src = evt.target;

        if (!src.classList.contains('table-of-contents__link')) {
            return;
        }

        let navigateTo = src.dataset.nav;

        scrollTo({
            behavior: 'smooth',
            top: window.pageYOffset + sectionsMap[navigateTo].getBoundingClientRect().top
        });
    };

    headerNav.addEventListener('click', (evt) => pageNavigate(evt, 'header__nav-item'));

})()
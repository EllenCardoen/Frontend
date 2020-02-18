const _getFromLocalStorage = key => {
    return localStorage[key] ? JSON.parse(localStorage[key]) : [];
}

let visitedCountries = {
        africa: _getFromLocalStorage('visitedCountriesAfrica'),
        americas: _getFromLocalStorage('visitedCountriesAmericas'),
        asia: _getFromLocalStorage('visitedCountriesAsia'),
        europe: _getFromLocalStorage('visitedCountriesEurope'),
        oceania: _getFromLocalStorage('visitedCountriesOceania'),
    },
    selectedContinent = 'europe';

const saveInBrowser = () => {
    localStorage.setItem('visitedCountries', JSON.stringify(visitedCountries));
}

const checkVisitedCount = () => {
    const counter = document.querySelector('js-count');
    let totalCountries = 0;

    for (const continent in visitedCountries){
        document.querySelector(`js-${continent}`).dataset.count = 
            visitedCountries[continent].length;
        totalCountries = visitedCountries[continent].length;
    }
    counter.innerHTML = totalCountries;
}

const removeNotification = notificationElement => {
    let timing = getComputedStyle(document.documentElement).getPropertyValue('--fade-out-transition-timing');
    console.log(timing.substr(0, timing.length -2));

    notificationElement.classList.add('u-faded'); //transition = 300ms
    setTimeout(() => {
        notificationElement.parentElement.removeChild(notificationElement);
    }, timing);
};

const showNotification = ({ countryName, countryKey}) => {
    // <div class="c-notification">
    //    <h3 class="c-notification__header">Je hebt België bezocht!</h3>
    //        <button class="c-notification__button js-undo">
    //        ongedaan maken
    //     </button>
    //</div>
    const notification = document.createElement('div');
    notification.classList.add('c-notification', 'u-will-fade');
    notification.innerHTML = `
        <h3 class="c-notification__header">
            Je hebt ${countryName} bezocht!
        </h3>
        `;
    
    const button = document.createElement('button');
    button.classList.add('c-notification__button');
    button.innerText = "Ongedaan maken";

    button.addEventListener('click', () => {
        removeCountryFromVisited(countryKey);
        document.querySelector(`#${countryName}`).checked = false;

        if(timeout) {
            clearTimeout(timeout);
            notification.parentElement.removeChild(notification);
        }
    });

    //voeg de button toe aan de notification
    notification.appendChild(button);
    
    //voeg de notification in zijn geheel toe aan de notification-holder
    document.querySelector('.js-notifications').appendChild(notification);

    const timeout = setTimeout(() => {
        removeNotification(notification);
    }, 3000);
};

const removeCountryFromVisited = countryCode => {
    visitedCountries[selectedContinent] = visitedCountries[selectedContinent].filter(c => c !== country.value );
    
    saveInBrowser();
    checkVisitedCount();
}

const enableListenersToCountries = () => {
    const countries = document.querySelectorAll('.js-country');
    for (const country of countries) {
        country.addEventListener('change', function() {
            if (country.checked) {
                visitedCountries[selectedContinent].push(country.value);

                showNotification({
                    countryName: country.id, //omdat het id 'toevallig' al de country.name gebruikt!!
                    countryKey: country.value,
                });
            }
            else {
                removeCountryFromVisited(country.value);
            }
            saveInBrowser();
            checkVisitedCount();
        });
    }
};

//in de volgende line wil (continent='europa') zeggen dat we het continent automatisch op europa zetten als default"
const showCountriesForContinent = async (continent = 'europe') => {

    const countryHolder = document.querySelector('.js-countries');
    //correcte manier van werken is om deze fetch in een try catch te steken!!!
    countryHolder.innerHTML = '';

    const data = await fetch(`http://restcountries.eu/rest/v2/region/${continent}`).then(r => r.json());
    
    for (const country of data) {
        console.log(country);
        countryHolder.innerHTML += `
            <div>
                <input type="checkbox" id="${country.name}" class="o-hide-accessible c-country__input js-country" ${(visitedCountries[selectedContinent].includes(country.alpha2Code)) ? `checked` : ``} value="${country.alpha2Code}" />
                <label class="c-country u-cursor-pointer" for="${country.name}">
                    <div class="c-country__header ">
                        <h2 class="c-country__name js-name">${country.name}</h2>
                        <img class="c-country__flag" src="${country.flag}" alt="The flag of ${country.name}" />
                    </div>
                    <p class="c-country__native-name">${country.nativeName}</p>
                </label>
            </div>
        `;
    }

    enableListenersToCountries();
}

const listenToContinentChange = () => {
    const continents = document.querySelectorAll('.js-continent');
    console.log(continents);
    for (const button of continents) {
        button.addEventListener('click', function() {
            selectedContinent = button.innerText;
            console.log(button.dataset.continent); // met curly brackets wordt de variabele naam, etc. ook getoond!!

            showCountriesForContinent(button.dataset.continent);
        });
    }
}

// const enableReset = () => {
//     document.querySelector('.js-reset').addEventListener('click', () => {
//         //#1 Clear app.js state.
//         visitedCountries = {
//             africa = [],
//             americas = [],
//             asia = [],
//             europe = [],
//             oceania = [],
//         };

//         //#2 Clear localstorage state.
//         localStorage.clear(); //Alles weggooiennnnnnnnnnnnnnnnn.
//         //window.location.reload(); //Bad practise. Network requests alles opnieuw.

//         //#3 Update the UI

//     });
// }

document.addEventListener('DOMContentLoaded', function(){
    listenToContinentChange();

    showCountriesForContinent();
    checkVisitedCount(); //Misschien waren er nog countries in localStorage...
});

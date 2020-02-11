let visitedCountries = localStorage.visitedCountries
    ? JSON.parse(localStorage.visitedCountries : []; //

const saveInBrowser = () => {
    localStorage.setItem('visitedCountries', JSON.stringify(visitedCountries));
}

const checkVisitedCount = () => {
    const counter = document.querySelector('js-count');
    counter.innerHTML = visitedCountries.length;
}

const enableListenersToCountries = () => {
    const countries = document.querySelectorAll('.js-country');
    for (const country of countries) {
        country.addEventListener('change', function() {
            if (country.checked) {
                visitedCountries.push(country.value);
            }
            else {
                visitedCountries = visitedCountries.filter(c => c !== country.value );
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
                <input type="checkbox" id="${country.name}" class="o-hide-accessible c-country__input js-country" ${(visitedCountries.includes(country.alpha2Code)) ? `checked` : ``} value="${country.alpha2Code}" />
                <label class="c-country u-cursor-pointer" for="${country.name}">
                    <div class="c-country__header ">
                        <h2 class="c-country__name">${country.name}</h2>
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
            showCountriesForContinent(button.innerText);
        });
    }
}

document.addEventListener('DOMContentLoaded', function(){
    listenToContinentChange();

    showCountriesForContinent();
    checkVisitedCount(); //Misschien waren er nog countries in localStorage...
});

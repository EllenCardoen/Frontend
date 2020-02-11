//in de volgende lijn wil (continent='europa') zeggen dat we het continent automatisch op europa zetten als default"
const showCountriesForContinent = async (continent = 'europe') => {

    const countryHolder = document.querySelector('.js-countries');
    //correcte manier van werken is om deze fetch in een try catch te steken!!!
    countryHolder.innerHTML = '';

    const data = await fetch(`http://restcountries.eu/rest/v2/region/${continent}`).then(r => r.json());
    
    for (const country of data) {
        console.log(country);
        countryHolder.innerHTML += `
            <div>
                <input type="checkbox" id="" class="o-hide-accessible c-country__input" />
                <label class="c-country" for="${country.name}">
                    <div class="c-country__header">
                        <h2 class="c-country__name">${country.name}</h2>
                        <img class="c-country__flag" src="${country.flag}" alt="The flag of ${country.name}" />
                    </div>
                    <p class="c-country__native-name">${country.nativeName}</p>
                </label>
            </div>
        `;
    }
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
});

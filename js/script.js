const clickRephraseIt = () => {
    let value = document.getElementById('original').value;
    if (value === 'test') {
        dataFetched('tested');
        return;
    }
    if (value.length > 0) {
        fetchData(value);
        setLoadingState();
    } else {
        return;
    }
}

const setLoadingState = () => {
    document.getElementById('rephraseLoad').innerHTML = 'Loading';
    document.getElementById('rephraseLoad').disabled = true;
}

const setNormalState = () => {
    document.getElementById('rephraseLoad').innerHTML = 'Rephrase';
    document.getElementById('rephraseLoad').disabled = false;
}

const updateCharactersCount = () => {
    var textLength = document.getElementById('original').value.length;
    document.getElementById('count_message').innerHTML = textLength + ' / ' + 280;
}

const copyTextToClipboard = () => {
    var text = document.getElementById('result').textContent;
    navigator.clipboard.writeText(text).then(() => {
        console.log('Async: Copying to clipboard was successful!');
    }, (err) => {
        console.error('Async: Could not copy text: ', err);
    });
}

const getSelectedTemplate = () => {
    var select = document.getElementById('template-select');
    return select.value;
}

const dataFetched = (text) => {
    document.getElementById('show').style.visibility = "visible";
    document.getElementById('result').innerHTML = text;
    document.getElementById('s-title').innerHTML = getSelectedTemplate();
}

const tweet = () => {
    var updatedTweet = document.getElementById('result').innerHTML;
    var urlEncodedUpdatedTweet = encodeURIComponent(updatedTweet);
    var url = 'https://twitter.com/intent/tweet?text=' + urlEncodedUpdatedTweet;
    var win = window.open(url, '_blank');
    win.focus();
}

const populateSelect = (listOfTemplates) => {
    var select = document.getElementById('template-select');
    select.innerHTML = '';
    listOfTemplates.forEach(function(option) {
        if (option === 'DEFAULT') {
            return;
        }
        var optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        if (window.defaultTemplateName === option) {
            optionElement.selected = true;
        }
        select.appendChild(optionElement);
    });
}

const saveDefaultTemplateName = (templateName) => {
    window.defaultTemplateName = templateName;
}

const fetchData = (value) => {
    const apiUrl = 'https://retweet-ewn37fowka-uc.a.run.app/rephrase';
    const requestBody = {
        'text': value,
        'template_name': getSelectedTemplate(),
        'recaptcha_token': window.recaptchaToken
    };
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    }).then((response) => {
        if (!response.ok) { // Guard clause
            console.log('Problem with response');
            return;
        }
        return response.json();
    }).then((response) => {
        dataFetched(response.text);
        setNormalState();
    }).catch((error) => {
        console.log(error);
        setNormalState();
    });
}

const requestRecaptcha = () => {
    grecaptcha.ready(() => {
        grecaptcha.execute('6LcCEdkjAAAAAGiq9C89dGK2VZ1RDgvtj4pCuXEk', {action: 'send_request'}).then((token) => {
            window.recaptchaToken = token;
        });
    });
}

const requestGetOnBackend = (path, requestHandler) => {
    const apiUrl = 'https://retweet-ewn37fowka-uc.a.run.app/' + path;
    return fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }).then((response) => {
        if (!response.ok) { // Guard clause
            console.log('Problem with response');
            return;
        }        
        return response.text();
    }).then(json => {
        var items = JSON.parse(json);
        requestHandler(items);
    });
}

window.onload = () => {
    requestGetOnBackend('/templates/DEFAULT', saveDefaultTemplateName).then(() => {
        requestGetOnBackend('/templates', populateSelect);
    });
    requestRecaptcha();
};

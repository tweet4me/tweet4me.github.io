const clickRephraseIt = () => {
    let value = document.getElementById('original').value;
    if (value.length > 0 && value.length < 340) {
        fetchData(value);
        document.getElementById('rephraseLoad').innerHTML = "Loading";
    } else {
        return;
    }
}

const copyTextToClipboard = () => {
    var text = document.getElementById('result').textContent;
    navigator.clipboard.writeText(text).then(() => {
        console.log('Async: Copying to clipboard was successful!');
    }, (err) => {
        console.error('Async: Could not copy text: ', err);
    });
}

const fetchData = (value) => {
    const apiUrl = 'https://retweet-ewn37fowka-uc.a.run.app/rephrase';
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "text": value })
    }).then((response) => {
        if (!response.ok) { // Guard clause
            console.log('Problem with response');
            return;
        }
        return response.json();
    }).then((response) => {
        document.getElementById('rephraseLoad').innerHTML = "Rephrase";
        document.getElementById('show').style.visibility = "visible";
        document.getElementById("result").innerHTML = response.text;
    }).catch((error) => {
        console.log(error);
    });
}

grecaptcha.ready(() => {
    grecaptcha.execute('6LcCEdkjAAAAAGiq9C89dGK2VZ1RDgvtj4pCuXEk', {action: 'send_request'}).then((token) => {
      document.getElementById('send-request-button').disabled = false;
      recaptchaToken = token;
    });
  });
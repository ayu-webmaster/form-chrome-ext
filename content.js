window.addEventListener('load', myConsoleFunction, false);

function myConsoleFunction() {
    const jsInitChecktimer = setInterval(checkForJSFinish, 111);
    const allForms = document.getElementsByTagName('form');

    function checkForJSFinish() {
        if (allForms.length > 0) {
            clearInterval(jsInitChecktimer);

            for (let i = 0; i < allForms.length; i += 1) {
                allForms[i].onsubmit = function() {
                    const allFormsInputItems = allForms[i].getElementsByTagName('input'); // type text, radio, checkbox
                    const allFormsTextAreaItems = allForms[i].getElementsByTagName(
                        'textarea',
                    );
                    const allFormsSelectItems1 = allForms[i].getElementsByTagName(
                        'select',
                    );
                    const allFormsSelectItems2 = allForms[i].getElementsByClassName(
                        'ant-select-selection',
                    );

                    const allFormsItems2 = [
                        ...allFormsInputItems,
                        ...allFormsTextAreaItems,
                        ...allFormsSelectItems1,
                        ...allFormsSelectItems2,
                    ];

                    const allKeyPairValues = {};

                    for (let j = 0; j < allFormsItems2.length; j += 1) {
                        const element = allFormsItems2[j];
                        const getFieldName =
                            element.getAttribute('data-testid') ||
                            element.getAttribute('data-fieldName') ||
                            element.name ||
                            '';

                        if (element.classList.contains('ant-select-search__field')) {
                            continue;
                        } else if (element.classList.contains('ant-select-selection')) {
                            if (getFieldName)
                                allKeyPairValues[getFieldName] = element.innerText

                        } else if (element.type === 'radio') {
                            if (getFieldName)
                                allKeyPairValues[`${getFieldName}-${element.value}`] = element.checked

                        } else if (getFieldName)
                            allKeyPairValues[getFieldName] = element.value
                    }
                    const firbaseDocumentKey = `${allForms[i].name || ''}-${new Date().toISOString()}`

                    fetch(`https://amigos.ayu.health/api/app/${firbaseDocumentKey}/firebase-store-values`, {
                        method: 'POST', 
                        mode: 'cors', 
                        cache: 'no-cache', 
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(allKeyPairValues) 
                    });

                };
            }
        }
    }
}
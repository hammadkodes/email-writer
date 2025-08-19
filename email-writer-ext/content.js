function findComposeToolbar() {
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];

    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null;

}

function createAIButton() {
    // const button = document.createElement('div');
    // button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    // button.innerHTML = 'AI Reply';
    // button.setAttribute('role', 'button');
    // button.setAttribute('data-tooltip', 'Generate AI Reply');

    // // Updated inline styles
    // button.style.cssText = `
    //     margin-right: 8px;
    //     padding: 0 16px;
    //     height: 36px;
    //     border-radius: 18px;
    //     background-color: #0b57d0;
    //     color: white;
    //     font-weight: bold;
    //     cursor: pointer;
    //     display: inline-flex;
    //     align-items: center;
    //     justify-content: center;
    //     border: none;
    //     font-size: 14px;
    //     vertical-align: middle;
    //     transition: background-color 0.3s;
    // `;
    
    // // Hover effect
    // button.addEventListener('mouseover', () => {
    //     button.style.backgroundColor = '#3367d6';
    // });
    // button.addEventListener('mouseout', () => {
    //     button.style.backgroundColor = '#0b57d0';
    // });
    
    // return button;


    const button = document.createElement('div');

    // Using the exact same Gmail button classes
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '1');
    button.setAttribute('data-tooltip', 'Generate AI Reply');

    // Style adjustments to match Gmail Send button exactly
    button.style.cssText = `
        margin-right: 8px;
        padding: 0 16px;
        height: 36px;
        border-radius: 18px;
        background-color: #0b57d0;
        color: white;
        font-weight: bold;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        font-size: 14px;
        box-sizing: border-box;
        vertical-align: middle;
    `;

    // Hover effect
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#3367d6';
    });
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#0b57d0';
    });

    return button;


}


function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];

    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            console.log("Email content found:", content.innerText.trim());
            return content.innerText.trim();
        }
    }
    console.log("No email content found");
    return null;
}

function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) existingButton.remove();

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("Toolbar not found");
        return;
    }

    console.log("Toolbar found, creating AI button");
    const button = createAIButton();
    button.classList.add('ai-reply-button');

    button.addEventListener('click', async () => {
        try {
            button.innerHTML = 'Generating...';
            button.disabled = true;

            const emailContent = getEmailContent();

            const response = await fetch('https://email-writer-deployment.onrender.com/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: "professional",
                }),
            })

            if (!response.ok) {
                throw new Error('API request failed with status ' + response.status);
            }

            const generatedReply = await response.text();

            const composeBox = document.querySelector('[role="textbox"]');

            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            }
        } catch (error) {
            console.error('Error generating reply:', error);
        }
        finally {
            button.innerHTML = 'AI Reply';
            button.disabled = false;
        }

    });

    toolbar.insertBefore(button, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );
        if (hasComposeElements) {
            console.log("Compose elements detected");
            setTimeout(injectButton, 500)
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
})
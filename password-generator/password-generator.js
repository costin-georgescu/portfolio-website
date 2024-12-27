// Character sets for password generation
const characterSets = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

const passwordOutput = document.querySelector('samp');
const passwordLengthSlider = document.getElementById('passwordLength');
const lengthDisplay = document.getElementById('lengthDisplay');
const copyButton = document.querySelector('svg');
const generateButton = document.getElementById('generateButton');

passwordLengthSlider.addEventListener('input', () => {
    lengthDisplay.textContent = passwordLengthSlider.value;
});

// Function to create a random password
function createPassword(length, includeSets) {
    let characters = '';
    let password = '';

    // Combine selected character sets
    includeSets.forEach(set => {
        characters += characterSets[set];
    });

    // Ensure at least one character from each selected set
    const requiredChars = includeSets.map(set => 
        characterSets[set][Math.floor(Math.random() * characterSets[set].length)]
    );

    // Generate remaining characters
    for (let i = requiredChars.length; i < length; i++) {
        password += characters[Math.floor(Math.random() * characters.length)];
    }

    // Shuffle the password to randomize required characters
    const passwordArray = [...requiredChars, ...password];
    for (let i = passwordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
    }

    return passwordArray.join('');
}

// Function to update password with current settings
function generatePassword() {
    const length = parseInt(passwordLengthSlider.value);
    const includeSets = [];
    
    // Dynamically check which checkboxes are selected
    if (document.getElementById('includeUppercase').checked) {
        includeSets.push('uppercase');
    }
    if (document.getElementById('includeLowercase').checked) {
        includeSets.push('lowercase');
    }
    if (document.getElementById('includeNumbers').checked) {
        includeSets.push('numbers');
    }
    if (document.getElementById('includeSymbols').checked) {
        includeSets.push('symbols');
    }
    
    // Only generate password if at least one set is selected
    if (includeSets.length > 0) {
        const newPassword = createPassword(length, includeSets);
        passwordOutput.textContent = newPassword;
    } else {
        passwordOutput.textContent = 'Select at least one character set';
    }
}

// Attach event listener to the generate button
generateButton.addEventListener('click', generatePassword);

// Copy password to clipboard
copyButton.addEventListener('click', async () => {
    const passwordToCopy = passwordOutput.textContent;
    
    if (passwordToCopy && passwordToCopy.trim() !== '') {
        try {
            await navigator.clipboard.writeText(passwordToCopy);
            
            // Temporarily change icon to checkmark
            copyButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-blue-500 animate-checkmark">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
            `;
            
            // Revert back to copy icon after 2 seconds
            setTimeout(() => {
                copyButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-blue-500 hover:scale-110 transition-all duration-200 cursor-pointer">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                    </svg>
                `;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy password', err);
        }
    }
});

//Initial state, the app will load a password on page load.
generatePassword();

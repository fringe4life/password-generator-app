// Password Generator App JavaScript

class PasswordGenerator {
  constructor() {
    this.initializeElements();
    this.bindEvents();
    this.updateLengthValue(); // Update length display first
    this.generatePassword(); // Generate initial password
  }

  initializeElements() {
    // Password display
    this.passwordOutput = document.getElementById('password-output');
    this.copyBtn = document.getElementById('copy-btn');
    
    // Length control
    this.lengthSlider = document.getElementById('length-slider');
    this.lengthValue = document.getElementById('length-value');
    
    // Checkboxes
    this.uppercaseCheckbox = document.getElementById('uppercase');
    this.lowercaseCheckbox = document.getElementById('lowercase');
    this.numbersCheckbox = document.getElementById('numbers');
    this.symbolsCheckbox = document.getElementById('symbols');
    
    // Strength meter
    this.strengthText = document.getElementById('strength-text');
    this.strengthBars = document.querySelectorAll('.strength-bar');
    
    // Generate button
    this.generateBtn = document.getElementById('generate-btn');
  }

  bindEvents() {
    // Length slider
    this.lengthSlider.addEventListener('input', () => {
      this.updateLengthValue();
      this.generatePassword();
    });

    // Checkboxes
    this.uppercaseCheckbox.addEventListener('change', () => this.generatePassword());
    this.lowercaseCheckbox.addEventListener('change', () => this.generatePassword());
    this.numbersCheckbox.addEventListener('change', () => this.generatePassword());
    this.symbolsCheckbox.addEventListener('change', () => this.generatePassword());

    // Copy button
    this.copyBtn.addEventListener('click', () => this.copyPassword());

    // Generate button
    this.generateBtn.addEventListener('click', () => this.generatePassword());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.generatePassword();
        }
        if (e.key === 'c' && document.activeElement === this.passwordOutput) {
          e.preventDefault();
          this.copyPassword();
        }
      }
    });
  }

  updateLengthValue() {
    this.lengthValue.textContent = this.lengthSlider.value;
  }

  generatePassword() {
    const length = parseInt(this.lengthSlider.value);
    const hasUppercase = this.uppercaseCheckbox.checked;
    const hasLowercase = this.lowercaseCheckbox.checked;
    const hasNumbers = this.numbersCheckbox.checked;
    const hasSymbols = this.symbolsCheckbox.checked;

    // Handle zero length case - clear the input to show placeholder
    if (length === 0) {
      this.passwordOutput.value = '';
      this.updateStrengthMeter(0);
      this.generateBtn.disabled = false;
      return;
    }

    // Validate that at least one option is selected
    if (!hasUppercase && !hasLowercase && !hasNumbers && !hasSymbols) {
      this.passwordOutput.value = 'Please select at least one option';
      this.updateStrengthMeter(0);
      this.generateBtn.disabled = true;
      return;
    }

    this.generateBtn.disabled = false;

    // Character sets
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Build available characters
    let availableChars = '';
    if (hasUppercase) availableChars += uppercase;
    if (hasLowercase) availableChars += lowercase;
    if (hasNumbers) availableChars += numbers;
    if (hasSymbols) availableChars += symbols;

    // Generate password ensuring at least one character from each selected type
    let password = '';
    const selectedTypes = [];
    if (hasUppercase) selectedTypes.push(uppercase);
    if (hasLowercase) selectedTypes.push(lowercase);
    if (hasNumbers) selectedTypes.push(numbers);
    if (hasSymbols) selectedTypes.push(symbols);

    // Add one character from each selected type first
    selectedTypes.forEach(charSet => {
      password += charSet[Math.floor(Math.random() * charSet.length)];
    });

    // Fill the rest with random characters
    for (let i = password.length; i < length; i++) {
      password += availableChars[Math.floor(Math.random() * availableChars.length)];
    }

    // Shuffle the password
    password = this.shuffleString(password);

    // Update password display with animation
    this.animatePasswordChange(password);

    // Update strength meter
    this.updateStrengthMeter(this.calculatePasswordStrength(password));
  }

  shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }

  animatePasswordChange(newPassword) {
    const currentPassword = this.passwordOutput.value;
    if (currentPassword === newPassword) return;

    // Add fade out effect
    this.passwordOutput.style.opacity = '0.5';
    
    setTimeout(() => {
      this.passwordOutput.value = newPassword;
      this.passwordOutput.style.opacity = '1';
      
      // Add subtle animation
      if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        this.passwordOutput.style.transform = 'scale(1.02)';
        setTimeout(() => {
          this.passwordOutput.style.transform = 'scale(1)';
        }, 150);
      }
    }, 100);
  }

  calculatePasswordStrength(password) {
    let score = 0;
    
    // Length contribution
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Character variety contribution
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
    
    const varietyCount = [hasUppercase, hasLowercase, hasNumbers, hasSymbols]
      .filter(Boolean).length;
    
    score += varietyCount - 1; // -1 because we need at least 1 type
    
    // Bonus for mixed case
    if (hasUppercase && hasLowercase) score += 1;
    
    // Bonus for numbers and symbols
    if (hasNumbers && hasSymbols) score += 1;
    
    return Math.min(score, 4); // Cap at 4 for strength levels
  }

  updateStrengthMeter(strength) {
    // Clear all bars
    this.strengthBars.forEach(bar => {
      bar.classList.remove('filled', 'weak', 'medium', 'strong', 'very-strong');
    });

    // Check if there's a password value (not placeholder)
    const hasPassword = this.passwordOutput.value && this.passwordOutput.value !== 'Please select at least one option';

    // Determine strength level and text
    let strengthLevel, strengthText;
    
    if (!hasPassword) {
      strengthText = '';
    } else if (strength === 0) {
      strengthLevel = 'weak';
      strengthText = 'Too Weak';
    } else if (strength === 1) {
      strengthLevel = 'weak';
      strengthText = 'Weak';
    } else if (strength === 2) {
      strengthLevel = 'medium';
      strengthText = 'Medium';
    } else if (strength === 3) {
      strengthLevel = 'strong';
      strengthText = 'Strong';
    } else {
      strengthLevel = 'very-strong';
      strengthText = 'Very Strong';
    }

    // Update strength text
    this.strengthText.textContent = strengthText;

    // Fill appropriate bars only if there's a password
    if (hasPassword) {
      for (let i = 0; i < strength; i++) {
        if (this.strengthBars[i]) {
          this.strengthBars[i].classList.add('filled', strengthLevel);
          
          // Add animation if motion is preferred
          if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
            this.strengthBars[i].style.animation = '--strength-fill 0.3s ease-out';
            setTimeout(() => {
              this.strengthBars[i].style.animation = '';
            }, 300);
          }
        }
      }
    }
  }

  async copyPassword() {
    const password = this.passwordOutput.value;
    
    if (!password || password === 'Please select at least one option') {
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      this.showCopySuccess();
    } catch (err) {
      // Fallback for older browsers
      this.fallbackCopyTextToClipboard(password);
    }
  }

  fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.showCopySuccess();
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
  }

  showCopySuccess() {
    // Create success message if it doesn't exist
    let successMessage = document.querySelector('.copy-success');
    if (!successMessage) {
      successMessage = document.createElement('div');
      successMessage.className = 'copy-success';
      successMessage.textContent = 'Copied!';
      document.querySelector('.password-display').appendChild(successMessage);
    }

    // Show the message
    successMessage.classList.add('show');

    // Hide after 2 seconds
    setTimeout(() => {
      successMessage.classList.remove('show');
    }, 2000);

    // Update copy button icon temporarily
    const originalIcon = this.copyBtn.querySelector('.copy-icon');
    const checkIcon = document.createElement('img');
    checkIcon.src = './assets/images/icon-check.svg';
    checkIcon.className = 'copy-icon';
    checkIcon.style.filter = 'brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(80deg)';
    
    this.copyBtn.replaceChild(checkIcon, originalIcon);
    
    setTimeout(() => {
      this.copyBtn.replaceChild(originalIcon, checkIcon);
    }, 2000);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PasswordGenerator();
});

// Add some utility functions for debugging
window.passwordGenerator = {
  generateTestPassword: (length = 8, options = {}) => {
    const generator = new PasswordGenerator();
    generator.lengthSlider.value = length;
    generator.uppercaseCheckbox.checked = options.uppercase !== false;
    generator.lowercaseCheckbox.checked = options.lowercase !== false;
    generator.numbersCheckbox.checked = options.numbers !== false;
    generator.symbolsCheckbox.checked = options.symbols !== false;
    generator.generatePassword();
  }
}; 
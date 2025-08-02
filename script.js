/**
 * Password Generator App JavaScript
 * @fileoverview Main application logic for the password generator
 */

/**
 * Password Generator Class
 * @class PasswordGenerator
 * @description Handles all password generation logic and UI interactions
 */
class PasswordGenerator {
  #strengthLevels; // Private field for strength level configurations
  #charSets; // Private field for character sets
  
  /**
   * Initialize the password generator
   * @constructor
   */
  constructor() {
    this.#initializeElements();
    this.#bindEvents();
    this.#updateLengthValue(); // Update length display first
    this.isFirstGenerate = true; // Track if this is the first generate click
    this.#generatePassword(); // Generate initial password (will show placeholder)
    
    // Strength level configurations (zero-indexed)
    this.#strengthLevels = [
      { level: 'weak', text: 'Too Weak' },
      { level: 'weak', text: 'Weak' },
      { level: 'medium', text: 'Medium' },
      { level: 'strong', text: 'Strong' },
      { level: 'very-strong', text: 'Very Strong' }
    ];

    // Character sets (reused across password generations)
    this.#charSets = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };
  }

  /**
   * Initialize all DOM elements
   * @private
   */
  #initializeElements() {
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

  /**
   * Bind all event listeners
   * @private
   */
  #bindEvents() {
    // Length slider
    this.lengthSlider.addEventListener('input', () => {
      this.#updateLengthValue();
      this.#generatePassword();
    });

    // Checkboxes
    this.uppercaseCheckbox.addEventListener('change', () => this.#generatePassword());
    this.lowercaseCheckbox.addEventListener('change', () => this.#generatePassword());
    this.numbersCheckbox.addEventListener('change', () => this.#generatePassword());
    this.symbolsCheckbox.addEventListener('change', () => this.#generatePassword());

    // Copy button
    this.copyBtn.addEventListener('click', () => this.#copyPassword());

    // Generate button
    this.generateBtn.addEventListener('click', () => this.#handleGenerateClick());

    // Keyboard shortcuts
    document.addEventListener('keydown', ({ ctrlKey, metaKey, key, preventDefault }) => {
      if (ctrlKey || metaKey) {
        if (key === 'Enter') {
          preventDefault();
          this.#generatePassword();
        }
        if (key === 'c' && document.activeElement === this.passwordOutput) {
          preventDefault();
          this.#copyPassword();
        }
      }
    });
  }

  /**
   * Update the length value display
   * @private
   */
  #updateLengthValue() {
    this.lengthValue.textContent = this.lengthSlider.value;
  }

  /**
   * Handle generate button click with first-time setup
   * @private
   */
  #handleGenerateClick() {
    // If this is the first generate click, set defaults
    if (this.isFirstGenerate) {
      this.lengthSlider.value = 8;
      this.uppercaseCheckbox.checked = true;
      this.lowercaseCheckbox.checked = true;
      this.numbersCheckbox.checked = true;
      this.#updateLengthValue();
      this.isFirstGenerate = false;
    }
    
    // Ensure length value is up to date before generating
    this.#updateLengthValue();
    this.#generatePassword();
  }

  /**
   * Generate a new password based on current settings
   * @private
   */
  #generatePassword() {
    const length = parseInt(this.lengthSlider.value);
    const hasUppercase = this.uppercaseCheckbox.checked;
    const hasLowercase = this.lowercaseCheckbox.checked;
    const hasNumbers = this.numbersCheckbox.checked;
    const hasSymbols = this.symbolsCheckbox.checked;

    // Handle zero length case - clear the input to show placeholder
    if (length === 0) {
      this.passwordOutput.value = '';
      this.#updateStrengthMeter(0);
      this.generateBtn.disabled = false;
      return;
    }

    // Validate that at least one option is selected
    if (!hasUppercase && !hasLowercase && !hasNumbers && !hasSymbols) {
      
      this.#updateStrengthMeter(0);
      this.generateBtn.disabled = true;
      return;
    }

    this.generateBtn.disabled = false;

    // Build available characters and selected types
    const options = { uppercase: hasUppercase, lowercase: hasLowercase, numbers: hasNumbers, symbols: hasSymbols };
    const availableChars = Object.entries(this.#charSets).filter(([key]) => options[key]).map(([, chars]) => chars).join('');
    const selectedTypes = Object.entries(this.#charSets).filter(([key]) => options[key]).map(([, chars]) => chars);

    // Generate password ensuring at least one character from each selected type
    let password = '';


    for (const charSet of selectedTypes) {
      password += this.#getRandomChar(charSet);
    }

    // Fill the rest with random characters
    for (let i = password.length; i < length; i++) {
      password += this.#getRandomChar(availableChars);
    }

    // Shuffle the password
    password = this.#shuffleString(password);

    // Update password display with animation and strength meter
    this.#animatePasswordChange(password, this.#calculatePasswordStrength(password));
  }

  /**
   * Get a random character from a string
   * @param {string} charSet - The character set to select from
   * @returns {string} A random character from the set
   * @private
   */
  #getRandomChar(charSet) {
    return charSet[Math.floor(Math.random() * charSet.length)];
  }

  /**
   * Shuffle a string using Fisher-Yates algorithm
   * @param {string} str - The string to shuffle
   * @returns {string} The shuffled string
   * @private
   */
  #shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }

  /**
   * Animate password change with fade effect
   * @param {string} newPassword - The new password to display
   * @param {number} strength - The password strength to update
   * @private
   */
  #animatePasswordChange(newPassword, strength) {
    const currentPassword = this.passwordOutput.value;
    if (currentPassword === newPassword) return;

    // Add fade out effect
    this.passwordOutput.style.opacity = '0.5';
    
    setTimeout(() => {
      this.passwordOutput.value = newPassword;
      this.passwordOutput.style.opacity = '1';
      
      // Update strength meter after password is set
      this.#updateStrengthMeter(strength);
      
      // Add subtle animation
      if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        this.passwordOutput.style.scale = '1.02';
        setTimeout(() => {
          this.passwordOutput.style.scale = '1';
        }, 150);
      }
    }, 100);
  }

  /**
   * Calculate password strength based on length and character variety
   * @param {string} password - The password to evaluate
   * @returns {number} Strength score (0-4)
   * @private
   */
  #calculatePasswordStrength(password) {
    let score = 0;
    
    // Length contribution
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Character variety contribution
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password);
    
    const varietyCount = [hasUppercase, hasLowercase, hasNumbers, hasSymbols]
      .filter(Boolean).length;
    
    score += varietyCount - 1; // -1 because we need at least 1 type
    
    // Bonus for numbers and symbols (only if both are present)
    if (hasNumbers && hasSymbols) score += 1;
    
    return Math.min(score, 4); // Cap at 4 for strength levels
  }

  /**
   * Update the strength meter display
   * @param {number} strength - The strength score (0-4)
   * @private
   */
  #updateStrengthMeter(strength) {
    // Clear all bars
    this.strengthBars.forEach(bar => {
      bar.classList.remove('filled', 'weak', 'medium', 'strong', 'very-strong');
    });

    // Check if there's a password value (not placeholder)
    const hasPassword = this.passwordOutput.value !== '';

    // Get strength level and text from lookup array
    const { level: strengthLevel, text: strengthText } = hasPassword ? this.#strengthLevels[strength] : { level: '', text: '' };
    

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

  /**
   * Copy password to clipboard
   * @private
   */
  async #copyPassword() {
    const password = this.passwordOutput.value;
    
    if (!password ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      this.#showCopySuccess();
    } catch {
      // Fallback for older browsers
      
    }
  }


  /**
   * Show copy success message and update icon
   * @private
   */
  #showCopySuccess() {
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

/**
 * Initialize the app when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  new PasswordGenerator();
});

/**
 * Utility functions for debugging and testing
 * @type {Object}
 */
window.passwordGenerator = {
  /**
   * Generate a test password with specified options
   * @param {number} length - Password length
   * @param {Object} options - Password options
   * @param {boolean} [options.uppercase=true] - Include uppercase letters
   * @param {boolean} [options.lowercase=true] - Include lowercase letters
   * @param {boolean} [options.numbers=true] - Include numbers
   * @param {boolean} [options.symbols=true] - Include symbols
   */
  generateTestPassword: (length = 8, options = {}) => {
    const generator = new PasswordGenerator();
    generator.lengthSlider.value = length;
    generator.uppercaseCheckbox.checked = options.uppercase ?? true;
    generator.lowercaseCheckbox.checked = options.lowercase ?? true;
    generator.numbersCheckbox.checked = options.numbers ?? true;
    generator.symbolsCheckbox.checked = options.symbols ?? true;
    generator.generatePassword();
  }
}; 
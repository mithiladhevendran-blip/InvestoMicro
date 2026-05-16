// auth.js - View States and Authentication Handlers
let currentMode = 'login';

// Instantly fire safe session checking on entry redirecting if session is active
checkActiveSession(true);

function switchViewState(targetMode) {
    currentMode = targetMode;
    
    const title = document.getElementById('title');
    const subtitle = document.getElementById('subtitle');
    const mainBtn = document.getElementById('mainBtn');
    const toggleArea = document.getElementById('toggleArea');
    const passGroup = document.getElementById('password-group');
    const utilityArea = document.getElementById('utility-area');
    const ageGroup = document.getElementById('age-group');
    
    clearStatusMessages();

    if (currentMode === 'login') {
        title.innerText = "Welcome Back";
        subtitle.innerText = "Enter your details to sign in";
        mainBtn.innerText = "Sign In";
        passGroup.style.display = "block";
        utilityArea.style.display = "flex";
        ageGroup.style.display = "none"; // Hide age restriction
        toggleArea.innerHTML = `Don't have an account? <span onclick="switchViewState('signup')">Sign Up</span>`;
    } 
    else if (currentMode === 'signup') {
        title.innerText = "Create Account";
        subtitle.innerText = "Join MicroInvest to track spending";
        mainBtn.innerText = "Sign Up";
        passGroup.style.display = "block";
        utilityArea.style.display = "none";
        ageGroup.style.display = "flex"; // Show age restriction requirement
        toggleArea.innerHTML = `Already have an account? <span onclick="switchViewState('login')">Sign In</span>`;
    } 
    else if (currentMode === 'forgot') {
        title.innerText = "Reset Password";
        subtitle.innerText = "Enter email to receive recovery instructions";
        mainBtn.innerText = "Send Reset Link";
        passGroup.style.display = "none";
        utilityArea.style.display = "none";
        ageGroup.style.display = "none";
        toggleArea.innerHTML = `Back to <span onclick="switchViewState('login')">Sign In</span>`;
    }
}

async function handleAuthAction() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const ageChecked = document.getElementById('ageCheck').checked;
    const mainBtn = document.getElementById('mainBtn');
    
    clearStatusMessages();

    if (!email) { showMsg('error', 'Please enter your email address.'); return; }
    if (currentMode !== 'forgot' && !password) { showMsg('error', 'Please fill in your password.'); return; }
    
    // AGE GATE ENFORCEMENT LAYER
    if (currentMode === 'signup' && !ageChecked) {
        showMsg('error', 'You must be at least 15 years old to create an account.');
        return;
    }

    mainBtn.disabled = true;
    mainBtn.innerText = "Processing...";

    try {
        if (currentMode === 'login') {
            const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            window.location.href = 'input.html';
        } 
        else if (currentMode === 'signup') {
            // Save age agreement response using the options.data payload metadata feature
            const { data, error } = await _supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        is_above_fifteen: true,
                        registered_at: new Date().toISOString()
                    }
                }
            });
            if (error) throw error;
            showMsg('success', 'Sign up complete! Check your email for confirmation links.');
            switchViewState('login');
        } 
        else if (currentMode === 'forgot') {
            const { data, error } = await _supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/input.html',
            });
            if (error) throw error;
            showMsg('success', 'Recovery link sent! Please check your inbox.');
        }
    } catch (err) {
        showMsg('error', err.message || 'An unexpected operation error occurred.');
    } finally {
        mainBtn.disabled = false;
        if (currentMode === 'login') mainBtn.innerText = "Sign In";
        else if (currentMode === 'signup') mainBtn.innerText = "Sign Up";
        else if (currentMode === 'forgot') mainBtn.innerText = "Send Reset Link";
    }
}

function showMsg(type, text) {
    const el = document.getElementById(`${type}-msg`);
    el.innerText = text;
    el.style.display = "block";
}

function clearStatusMessages() {
    document.getElementById('error-msg').style.display = "none";
    document.getElementById('success-msg').style.display = "none";
}

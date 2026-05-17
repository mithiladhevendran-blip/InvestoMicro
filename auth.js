// auth.js - View States and Authentication Handlers
let currentMode = 'login';

// FIX #1: checkActiveSession is now called safely after config.js has fully
// loaded (script order in HTML is config.js → auth.js). This call is
// legitimate here because _supabase is guaranteed to exist by this point.
checkActiveSession(true);

function switchViewState(targetMode) {
    currentMode = targetMode;

    const title       = document.getElementById('title');
    const subtitle    = document.getElementById('subtitle');
    const mainBtn     = document.getElementById('mainBtn');
    const toggleArea  = document.getElementById('toggleArea');
    const passGroup   = document.getElementById('password-group');
    const utilityArea = document.getElementById('utility-area');
    const ageGroup    = document.getElementById('age-group');

    clearStatusMessages();

    if (currentMode === 'login') {
        title.innerText     = "Welcome Back";
        subtitle.innerText  = "Enter your details to sign in";
        mainBtn.innerText   = "Sign In";
        passGroup.style.display   = "block";
        utilityArea.style.display = "flex";
        ageGroup.style.display    = "none";
        toggleArea.innerHTML = `Don't have an account? <span onclick="switchViewState('signup')">Sign Up</span>`;
    }
    else if (currentMode === 'signup') {
        title.innerText     = "Create Account";
        subtitle.innerText  = "Join MicroInvest to track spending";
        mainBtn.innerText   = "Sign Up";
        passGroup.style.display   = "block";
        utilityArea.style.display = "none";
        ageGroup.style.display    = "flex";
        toggleArea.innerHTML = `Already have an account? <span onclick="switchViewState('login')">Sign In</span>`;
    }
    else if (currentMode === 'forgot') {
        title.innerText     = "Reset Password";
        subtitle.innerText  = "Enter email to receive recovery instructions";
        mainBtn.innerText   = "Send Reset Link";
        passGroup.style.display   = "none";
        utilityArea.style.display = "none";
        ageGroup.style.display    = "none";
        toggleArea.innerHTML = `Back to <span onclick="switchViewState('login')">Sign In</span>`;
    }
}

async function handleAuthAction() {
    const email    = document.getElementById('email').value.trim();
    // FIX #4: Do NOT trim passwords — trimming silently breaks passwords that
    // intentionally start or end with a space.
    const password   = document.getElementById('password').value;
    const ageChecked = document.getElementById('ageCheck').checked;
    const mainBtn    = document.getElementById('mainBtn');

    clearStatusMessages();

    // FIX #6: Validate email format, not just presence.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showMsg('error', 'Please enter your email address.');
        return;
    }
    if (!emailRegex.test(email)) {
        showMsg('error', 'Please enter a valid email address.');
        return;
    }
    if (currentMode !== 'forgot' && !password) {
        showMsg('error', 'Please fill in your password.');
        return;
    }

    // AGE GATE ENFORCEMENT LAYER
    if (currentMode === 'signup' && !ageChecked) {
        showMsg('error', 'You must be at least 15 years old to create an account.');
        return;
    }

    // FIX #3: Capture the mode BEFORE any async work so the finally block
    // always restores the correct button label, even if switchViewState()
    // changes currentMode mid-flight (e.g. after a successful signup).
    const modeAtStart = currentMode;

    mainBtn.disabled  = true;
    mainBtn.innerText = "Processing...";

    try {
        if (currentMode === 'login') {
            const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            window.location.href = 'input.html';
        }
        else if (currentMode === 'signup') {
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
        // FIX #3: Use the mode that was active when the button was clicked,
        // not whatever currentMode happens to be now.
        if (modeAtStart === 'login')  mainBtn.innerText = "Sign In";
        else if (modeAtStart === 'signup') mainBtn.innerText = "Sign Up";
        else if (modeAtStart === 'forgot') mainBtn.innerText = "Send Reset Link";
    }
}

function showMsg(type, text) {
    const el = document.getElementById(`${type}-msg`);
    el.innerText     = text;
    el.style.display = "block";
}

function clearStatusMessages() {
    document.getElementById('error-msg').style.display   = "none";
    document.getElementById('success-msg').style.display = "none";
}

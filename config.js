// config.js - Centralized Supabase Configuration

const S_URL =
'https://funcvigewkhauenqxrbf.supabase.co';

const S_KEY =
'YOUR_ANON_KEY_HERE';

// Initialize Supabase globally
const _supabase =
    supabase.createClient(S_URL, S_KEY);

// Prevent redirect loops
let isRedirecting = false;

// Shared auth/session checker
async function checkActiveSession(
    redirectOnSuccess = false
) {

    if (isRedirecting) return null;

    try {

        const currentPage =
            window.location.pathname;

        const { data, error } =
            await _supabase.auth.getSession();

        if (error) {
            console.error(error);
            return null;
        }

        // User HAS session
        if (data && data.session) {

            // Redirect logged-in users
            // away from login page
            if (
                redirectOnSuccess &&
                !currentPage.includes("reset.html")
            ) {

                isRedirecting = true;

                window.location.href =
                    'input.html';
            }

            return data.session.user;
        }

        // No session on protected pages
        if (
            !redirectOnSuccess &&
            !currentPage.includes("index.html") &&
            !currentPage.includes("reset.html")
        ) {

            isRedirecting = true;

            window.location.href =
                'index.html';
        }

    } catch (e) {

        console.error(
            "Session verification failed:",
            e
        );
    }

    return null;
}

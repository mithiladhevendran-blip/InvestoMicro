// config.js

const S_URL =
'https://funcvigewkhauenqxrbf.supabase.co';

const S_KEY =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bmN2aWdld2toYXVlbnF4cmJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NTM1MzQsImV4cCI6MjA5NDEyOTUzNH0.INR7nkrv-CV80i97SyaHwdZd3chlQjaVgNsQY39Nqxo';

const _supabase =
    supabase.createClient(
        S_URL,
        S_KEY
    );

let isRedirecting = false;

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

        // User has session
        if (data && data.session) {

            // Never redirect reset page
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

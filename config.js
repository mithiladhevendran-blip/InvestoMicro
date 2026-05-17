// Shared function to protect pages and check for active user sessions
async function checkActiveSession(redirectOnSuccess = false) {

    if (isRedirecting) return null;

    try {

        const currentPage = window.location.pathname;

        const { data } = await _supabase.auth.getSession();

        if (data && data.session) {

            // IMPORTANT:
            // Do NOT redirect during password recovery flow
            if (
                redirectOnSuccess &&
                !currentPage.includes("reset.html")
            ) {
                isRedirecting = true;
                window.location.href = 'input.html';
            }

            return data.session.user;

        } else if (!redirectOnSuccess) {

            isRedirecting = true;
            window.location.href = 'index.html';
        }

    } catch (e) {

        console.error("Session verification failed:", e);
    }

    return null;
}

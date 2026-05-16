// config.js - Centralized Supabase Configuration
const S_URL = 'https://funcvigewkhauenqxrbf.supabase.co';
const S_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bmN2aWdld2toYXVlbnF4cmJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NTM1MzQsImV4cCI6MjA5NDEyOTUzNH0.INR7nkrv-CV80i97SyaHwdZd3chlQjaVgNsQY39Nqxo';

// Initialize Supabase Client globally
const _supabase = supabase.createClient(S_URL, S_KEY);

// Shared function to protect pages and check for active user sessions
async function checkActiveSession(redirectOnSuccess = false) {
    try {
        const { data } = await _supabase.auth.getSession();
        if (data && data.session) {
            if (redirectOnSuccess) {
                window.location.href = 'input.html';
            }
            return data.session.user;
        } else if (!redirectOnSuccess) {
            // If we are on an internal page and no session exists, boot back to login
            window.location.href = 'index.html';
        }
    } catch (e) {
        console.error("Session verification failed:", e);
    }
    return null;
}

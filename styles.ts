// This file is now primarily for color constants that might be used in logic
// Most styling is now handled via Tailwind CSS classes.

export const primaryBlue = '#3B82F6';
export const primaryPink = '#EC4899';
export const bgLight = '#F8FAFC';
export const borderLight = '#E2E8F0';
export const textPrimary = '#1E293B';
export const textSecondary = '#64748B';

// Deprecated styles object for migration safety
export const styles: { [key: string]: React.CSSProperties } = {
    appContainer: {
        minHeight: '100vh',
        position: 'relative',
    }
};

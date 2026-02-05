export interface BioTheme {
    id: string;
    name: string;
    type: 'solid' | 'gradient' | 'image';
    background: string;
    textColor: string;
    buttonStyle: 'rounded' | 'pill' | 'square' | 'shadow';
    buttonBg: string;
    buttonText: string;
}

export const BIO_THEMES: BioTheme[] = [
    {
        id: 'default',
        name: 'Clean White',
        type: 'solid',
        background: 'bg-slate-50', // Utility class or hex? Better to use classes for Tailwind or style objects for custom values.
        // For maximum flexibility with arbitrary gradients, we should probably use inline styles for background.
        // But for presets, Tailwind classes are easier if they exist, or raw CSS values.
        // Let's use raw CSS strings for 'background' to support complex gradients.
        textColor: '#1e293b', // slate-800
        buttonStyle: 'rounded',
        buttonBg: '#ffffff',
        buttonText: '#1e293b',
    },
    {
        id: 'midnight',
        name: 'Midnight Depth',
        type: 'gradient',
        background: 'linear-gradient(to bottom, #0f172a, #1e293b)', // slate-900 to slate-800
        textColor: '#f8fafc', // slate-50
        buttonStyle: 'pill',
        buttonBg: 'rgba(255, 255, 255, 0.1)',
        buttonText: '#ffffff',
    },
    {
        id: 'sunset',
        name: 'Sunset Glow',
        type: 'gradient',
        background: 'linear-gradient(to bottom right, #ff5f6d, #ffc371)',
        textColor: '#ffffff',
        buttonStyle: 'shadow',
        buttonBg: '#ffffff',
        buttonText: '#ff5f6d',
    },
    {
        id: 'ocean',
        name: 'Ocean Breeze',
        type: 'gradient',
        background: 'linear-gradient(to top, #48c6ef 0%, #6f86d6 100%)',
        textColor: '#ffffff',
        buttonStyle: 'rounded',
        buttonBg: 'rgba(255, 255, 255, 0.2)',
        buttonText: '#ffffff',
    },
    {
        id: 'cyber',
        name: 'Cyberpunk',
        type: 'gradient',
        background: 'linear-gradient(45deg, #111111 0%, #2a0845 100%)',
        textColor: '#00ff41', // Matrix green / Neon
        buttonStyle: 'square',
        buttonBg: '#000000',
        buttonText: '#00ff41',
    },
];

export function getTheme(id: string): BioTheme {
    return BIO_THEMES.find(t => t.id === id) || BIO_THEMES[0];
}

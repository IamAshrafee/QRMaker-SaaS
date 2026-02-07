/**
 * Generates a standard WiFi connection string for QR codes.
 * Format: WIFI:T:WPA;S:mynetwork;P:mypassword;H:false;;
 */
export function generateWiFiString(ssid: string, password?: string, encryption: string = "WPA", hidden: boolean = false): string {
    // Escape special characters: \ replaced with \\, ; replaced with \;, : replaced with \:, , replaced with \,
    const escape = (str: string) => str.replace(/([\\;:,])/g, '\\$1');

    const t = encryption || 'nopass';
    const s = escape(ssid);
    const p = password ? escape(password) : '';
    const h = hidden ? 'true' : 'false';

    return `WIFI:T:${t};S:${s};P:${p};H:${h};;`;
}

/**
 * Generates a vCard 3.0 string.
 */
export function generateVCardString(data: {
    firstName: string;
    lastName: string;
    phone?: string;
    mobile?: string;
    email?: string;
    website?: string;
    company?: string;
    jobTitle?: string;
    address?: string;
    fax?: string;
}): string {
    const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${data.lastName};${data.firstName};;;`,
        `FN:${data.firstName} ${data.lastName}`,
    ];

    if (data.company) lines.push(`ORG:${data.company}`);
    if (data.jobTitle) lines.push(`TITLE:${data.jobTitle}`);
    if (data.phone) lines.push(`TEL;TYPE=WORK,VOICE:${data.phone}`);
    if (data.mobile) lines.push(`TEL;TYPE=CELL,VOICE:${data.mobile}`);
    if (data.fax) lines.push(`TEL;TYPE=FAX:${data.fax}`);
    if (data.email) lines.push(`EMAIL:${data.email}`);
    if (data.website) lines.push(`URL:${data.website}`);
    if (data.address) lines.push(`ADR;TYPE=WORK:;;${data.address};;;;`);

    lines.push('END:VCARD');

    return lines.join('\n');
}

import { Analytics } from "@/models/Analytics";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";

/**
 * Tracks a link visit by recording user analytics data into the database.
 * 
 * @param linkId - The MongoDB ObjectId of the Link being visited
 * @param headers - The Request Headers object
 */
export async function trackLinkVisit(linkId: string, headers: Headers) {
    try {
        // 1. Extract IP Address
        // In Server Components, we rely on headers.
        const forwardedFor = headers.get("x-forwarded-for");
        const detectedIp = forwardedFor ? forwardedFor.split(",")[0] : "127.0.0.1";

        // 2. Geo Location Lookup
        const geo = geoip.lookup(detectedIp);
        const country = geo?.country || "Unknown";
        const city = geo?.city || "Unknown";

        // 3. Parse User Agent
        const userAgentString = headers.get("user-agent") || "";
        const parser = new UAParser(userAgentString);
        const result = parser.getResult();

        const browser = result.browser.name || "Unknown";
        const os = result.os.name || "Unknown";
        const deviceType = result.device.type || "Desktop"; // Default to Desktop if undefined

        // 4. Extract Referrer
        const referrer = headers.get("referer") || "Direct";

        // 5. Save to Database
        // Note: DB Connection is assumed to be handled by the caller.
        await Analytics.create({
            link: linkId,
            timestamp: new Date(),
            ip: detectedIp,
            userAgent: userAgentString,
            country,
            city,
            browser,
            os,
            device: deviceType,
            referrer
        });

        console.log(`[Analytics] Tracked visit for link ${linkId} from ${country}, ${city}`);

    } catch (error) {
        // Fail silently so we don't block the redirect/user flow
        console.error("[Analytics] Error tracking visit:", error);
    }
}

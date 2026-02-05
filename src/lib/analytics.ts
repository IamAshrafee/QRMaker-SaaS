import { Analytics } from "@/models/Analytics";
import { Link } from "@/models/Link";
import { UAParser } from "ua-parser-js";
import path from "path";
import fs from "fs";

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
        let country = "Unknown";
        let city = "Unknown";

        try {
            // Fix for Next.js/Turbopack failing to find geoip-lite data
            if (!(global as any).geodatadir) {
                const candidateDir = path.join(process.cwd(), "node_modules", "geoip-lite", "data");
                const candidateFile = path.join(candidateDir, "geoip-country.dat");

                if (fs.existsSync(candidateFile)) {
                    (global as any).geodatadir = candidateDir;
                } else {
                    // Data file missing, skip lookup to avoid ENOENT crash
                    throw new Error("GeoIP data file not found");
                }
            }

            // Dynamic import to ensure global is set before load
            const geoip = (await import("geoip-lite")).default;
            const geo = geoip.lookup(detectedIp);

            if (geo) {
                country = geo.country || "Unknown";
                city = geo.city || "Unknown";
            }
        } catch (geoError) {
            // Fail gracefully without spamming console for known missing file
            if ((geoError as any)?.message !== "GeoIP data file not found") {
                // console.warn("[Analytics] GeoIP lookup failed:", geoError);
            }
        }

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
        await Promise.all([
            Analytics.create({
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
            }),
            Link.findByIdAndUpdate(linkId, { $inc: { clicks: 1 } })
        ]);

        console.log(`[Analytics] Tracked visit for link ${linkId} from ${country}, ${city}`);

    } catch (error) {
        // Fail silently so we don't block the redirect/user flow
        console.error("[Analytics] Error tracking visit:", error);
    }
}

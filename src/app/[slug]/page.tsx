import { notFound, redirect } from "next/navigation"
import { headers } from "next/headers"
import connectDB from "@/lib/db"
import { User } from "@/models/User"
import { Link } from "@/models/Link"
import { trackLinkVisit } from "@/lib/analytics"
import { getTheme } from "@/lib/themes"

import { Metadata } from "next"

// --- Imports ---
import { cookies } from "next/headers"
import { PasswordChallenge } from "@/components/public/PasswordChallenge"
import { InterstitialPage } from "@/components/public/InterstitialPage"

// --- SEO Metadata Generation ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    await connectDB()

    // 1. Check User (Bio Page)
    const user = await User.findOne({ username: slug })
    if (user) {
        const bioLink = await Link.findOne({ user: user._id, type: 'bio' })
        const title = bioLink?.title || user.name || "My Bio Page"
        const desc = bioLink?.bioConfig?.description || `Check out ${user.name}'s links on QRMaker.`
        const image = bioLink?.bioConfig?.avatar

        return {
            title: title + " | QRMaker",
            description: desc,
            openGraph: {
                title,
                description: desc,
                images: image ? [image] : [],
                type: 'profile'
            }
        }
    }

    // 2. Check Link (QR or Bio)
    const link = await Link.findOne({ slug })
    if (link) {
        const title = link.title || "QRMaker Link"
        // If it's a bio page accessed via slug
        if (link.type === 'bio') {
            const desc = link.bioConfig?.description || "Check out these links."
            const image = link.bioConfig?.avatar
            return {
                title: title + " | QRMaker",
                description: desc,
                openGraph: {
                    title,
                    description: desc,
                    images: image ? [image] : []
                }
            }
        }
        // If it's a QR code redirect, we might not need rich metadata as it redirects fast,
        // but for sharing previews it's good.
        return {
            title: title,
            description: "Redirecting...",
            openGraph: { title }
        }
    }

    return {
        title: "Not Found | QRMaker",
        description: "The requested page was not found."
    }
}

// --- Helper: Permission Checks ---
function checkLinkAccessibility(link: any): { accessible: boolean, reason?: string } {
    // 1. Link Active
    if (!link.active) return { accessible: false, reason: "This link has been disabled." }

    // 2. Schedule
    const now = new Date()
    if (link.schedule?.activeFrom && now < new Date(link.schedule.activeFrom)) {
        return { accessible: false, reason: "This link is not yet active." }
    }
    if (link.schedule?.expireAt && now > new Date(link.schedule.expireAt)) {
        return { accessible: false, reason: "This link has expired." }
    }

    // 3. Scan Limits
    if (link.scanLimit && (link.clicks || 0) >= link.scanLimit) {
        return { accessible: false, reason: "This link has reached its scan limit." }
    }

    return { accessible: true }
}

export default async function DispatcherPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // 1. Connect DB
    await connectDB();

    // 2. Check for Username (Bio Page)
    const user = await User.findOne({ username: slug });
    if (user) {
        const bioLink = await Link.findOne({ user: user._id, type: 'bio' });
        if (bioLink) {
            // Bio Pages don't usually have scan limits/schedules in this MVP, 
            // but if they did, we'd check here.
            return renderBioPage(bioLink, user);
        }
    }

    // 3. Check for Short Link
    const link = await Link.findOne({ slug: slug }).populate('user');

    if (!link) return notFound();

    // --- ACCESSIBILITY CHECKS ---
    const access = checkLinkAccessibility(link)
    if (!access.accessible) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black p-4 text-center">
                <div className="max-w-md space-y-4">
                    <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                    <p className="text-muted-foreground">{access.reason}</p>
                </div>
            </div>
        )
    }

    // --- PASSWORD CHECK ---
    if (link.password) {
        const cookieStore = await cookies()
        const unlockKey = cookieStore.get(`qr_unlock_${link._id}`)?.value

        // If no cookie or wrong password (basic check)
        if (!unlockKey || unlockKey !== link.password) {
            return <PasswordChallenge linkId={link._id.toString()} title={link.title} />
        }
    }

    // --- TRACKING ---
    const headerList = await headers();
    // Fire & Forget tracking so user doesnt wait
    trackLinkVisit(link._id.toString(), headerList).catch(err => console.error("Tracking error:", err));

    // --- RENDER / REDIRECT ---

    // Bio Page
    if (link.type === 'bio') {
        return renderBioPage(link, link.user);
    }

    // QR Types
    if (link.type === 'qr') {
        // Interstitials for non-URL types
        if (link.qrType !== "url") {
            // We cast here because we know it's not "url", matching the InterstitialPage props
            return <InterstitialPage type={link.qrType as "wifi" | "vcard" | "text"} data={link} />
        }

        // Standard URL Redirect
        if (link.destinationUrl) {
            redirect(link.destinationUrl);
        }
    }

    return <div>Content not found.</div>
}

// Helper to render the Bio Page UI
function renderBioPage(link: any, user: any) {
    const links = link?.bioConfig?.links || [];
    const themeId = link?.bioConfig?.theme || 'default';
    const theme = getTheme(themeId);

    // Use link's specific info, fallback to user info
    const displayName = link.title || user?.name || "User";
    const displayAvatar = link.bioConfig?.avatar; // || user avatar if we had it
    const displayDesc = link.bioConfig?.description || "";
    const username = user?.username || "user";

    const buttonRadiusClass =
        theme.buttonStyle === 'pill' ? 'rounded-full' :
            theme.buttonStyle === 'square' ? 'rounded-none' :
                theme.buttonStyle === 'shadow' ? 'rounded-xl shadow-lg border-b-4 border-black/10' :
                    'rounded-lg'; // default/rounded

    return (
        <div
            className="min-h-screen flex justify-center p-4 transition-colors duration-500"
            style={{ background: theme.background, color: theme.textColor }}
        >
            <div className="w-full max-w-md mt-10 space-y-8">
                {/* Profile Header */}
                <div className="text-center space-y-4">
                    <div className="w-28 h-28 mx-auto rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 shadow-xl overflow-hidden relative">
                        {displayAvatar ? (
                            <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight drop-shadow-sm">{displayName}</h1>
                        <p className="opacity-80 font-medium">@{username}</p>
                        {displayDesc && <p className="mt-2 text-sm opacity-90">{displayDesc}</p>}
                    </div>
                </div>

                {/* Links */}
                <div className="space-y-4">
                    {links.length === 0 && (
                        <div className="text-center p-4 opacity-70">
                            No links added yet.
                        </div>
                    )}
                    {links.map((linkItem: any, idx: number) => (
                        <a
                            key={linkItem.id || idx}
                            href={linkItem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block w-full p-4 hover:scale-[1.02] hover:brightness-110 transition-all duration-200 text-center font-bold ${buttonRadiusClass}`}
                            style={{
                                background: theme.buttonBg,
                                color: theme.buttonText,
                                boxShadow: theme.buttonStyle === 'shadow' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none'
                            }}
                        >
                            {linkItem.title}
                        </a>
                    ))}
                </div>

                {/* Footer */}
                <div className="pt-8 text-center">
                    <a href="/" className="inline-flex items-center gap-1 text-xs font-semibold opacity-60 hover:opacity-100 transition-opacity">
                        <span className="w-3 h-3 bg-current rounded-full opacity-50"></span>
                        Created with QRMaker
                    </a>
                </div>
            </div>
        </div>
    );
}

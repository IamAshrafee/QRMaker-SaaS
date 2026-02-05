import { notFound, redirect } from "next/navigation"
import connectDB from "@/lib/db"
import { User } from "@/models/User"
import { Link } from "@/models/Link"

// This is the Catch-All Dispatcher
// It handles /username -> Bio Page
// It handles /shortId -> QR Redirect
export default async function DispatcherPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // 1. Connect DB
    await connectDB();

    // 2. Check for Username (Bio Page)
    const user = await User.findOne({ username: slug });
    if (user) {
        // Fetch the Bio Config for this user
        const bioLink = await Link.findOne({ user: user._id, type: 'bio' });
        const links = bioLink?.bioConfig?.links || [];

        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex justify-center p-4">
                <div className="w-full max-w-md mt-10 space-y-8">
                    {/* Profile Header */}
                    <div className="text-center space-y-4">
                        <div className="w-28 h-28 mx-auto rounded-full bg-slate-200 border-4 border-white shadow-lg overflow-hidden relative">
                            {/* Avatar Placeholder or Image */}
                            <div className="absolute inset-0 flex items-center justify-center bg-glorious-gradient text-white text-3xl font-bold">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
                            <p className="text-muted-foreground">@{user.username}</p>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-3">
                        {links.length === 0 && (
                            <div className="text-center p-4 text-muted-foreground">
                                No links added yet.
                            </div>
                        )}
                        {links.map((link: any, idx: number) => (
                            <a
                                key={link.id || idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:scale-[1.02] hover:shadow-md transition-all duration-200 text-center font-medium"
                            >
                                {link.title}
                            </a>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="pt-8 text-center">
                        <a href="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold opacity-70 hover:opacity-100 transition-opacity">
                            <span className="w-3 h-3 bg-indigo-500 rounded-sm"></span>
                            Created with QRMaker
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Check for Short Link (QR Redirect)
    const link = await Link.findOne({ slug: slug });
    if (link) {
        if (!link.active) {
            return <div>Link is disabled.</div>;
        }

        // TODO: Fire Analytics Event here (async)

        if (link.type === 'qr') {
            redirect(link.destinationUrl);
        }

        if (link.type === 'bio') {
            // This assumes specific bio page link? Or just redirect?
            // Usually bio type links are accessed via user profile, but if they have a short ID too:
            // We might prefer to redirect to the /username version or render it here.
            // For now, redirect to destinationUrl if present, else render.
            if (link.destinationUrl) redirect(link.destinationUrl);
        }
    }

    // 4. Nothing found
    return notFound();
}

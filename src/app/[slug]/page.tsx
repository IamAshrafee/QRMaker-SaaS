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
    const user = await User.findOne({ username: slug }); // Note: We need to add 'username' to User schema!
    if (user) {
        // Render Bio Page
        // In a real app, this would return <BioPageTemplate user={user} />
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-pink-500">
                    Bio Page for {user.name}
                </h1>
                <p className="mt-4 text-muted-foreground">This is where the specialized Bio Page theme will render.</p>
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

import { ThemeEditor } from "./theme-editor";
import { QRBuilder } from "@/components/dashboard/QRBuilder";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import LinkComponent from "next/link";
import { ArrowLeft } from "lucide-react";
import connectDB from "@/lib/db";
import { Link as LinkModel } from "@/models/Link";

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session) redirect("/login");

    const { id } = await params;

    await connectDB();
    const link = await LinkModel.findOne({ _id: id }).lean();

    if (!link) {
        return notFound();
    }

    // Verify ownership (or admin status)
    if (link.user.toString() !== session.user?.id && session.user?.role !== 'admin') {
        return <div>Unauthorized</div>;
    }

    if (link.type !== 'bio') {
        // Use JSON serialization to robustly convert all ObjectIds and Dates to strings/primitives
        // This prevents any "Only plain objects" errors for nested fields as well.
        const qrData = {
            ...JSON.parse(JSON.stringify(link)),
            id: link._id.toString()
        }

        return (
            <div className="h-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
                {/* Navbar for QR Editor */}
                <div className="h-16 border-b bg-white dark:bg-slate-900 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <LinkComponent href={`/dashboard/qrcodes`} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                        </LinkComponent>
                        <div>
                            <h1 className="font-bold text-lg">{link.title || "Untitled QR"}</h1>
                            <p className="text-xs text-muted-foreground">Editor</p>
                        </div>
                    </div>
                </div>

                {/* QR Builder in Edit Mode */}
                <div className="flex-1 overflow-hidden">
                    <QRBuilder initialData={qrData} />
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Navbar for Editor */}
            <div className="h-16 border-b bg-white dark:bg-slate-900 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <LinkComponent href={`/dashboard/links/${id}`} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </LinkComponent>
                    <div>
                        <h1 className="font-bold text-lg">{link.title || "Untitled Bio Page"}</h1>
                        <p className="text-xs text-muted-foreground">Editor</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <LinkComponent href={`/${link.slug}`} target="_blank" className="text-sm font-medium text-indigo-500 hover:text-indigo-400">
                        View Live Page
                    </LinkComponent>
                </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-hidden p-6">
                <ThemeEditor linkId={id} currentThemeId={link.bioConfig?.theme || 'default'} />
            </div>
        </div>
    );
}

import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import LinkComponent from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import connectDB from "@/lib/db";
import { Link as LinkModel } from "@/models/Link";
import { BioContentEditor } from "@/components/dashboard/BioContentEditor";

export default async function ContentEditorPage({ params }: { params: Promise<{ id: string }> }) {
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
        return (
            <div className="p-8 text-center text-muted-foreground">
                <p>This is a QR Code redirect, not a Bio Page.</p>
                <LinkComponent href={`/dashboard/links/${id}`} className="text-indigo-500 hover:underline mt-4 block">
                    Go Back
                </LinkComponent>
            </div>
        );
    }

    // Serialize the link object (convert _id to string)
    const serializedLink = {
        ...link,
        _id: link._id.toString(),
        user: link.user.toString(),
        // Check for bioConfig.themes which might be set but not breaking, 
        // but specifically nested _id's need to be handled if they exist.
        // For bioConfig.links, they are subdocuments.
        bioConfig: {
            ...link.bioConfig,
            links: (link.bioConfig?.links || []).map((l: any) => ({
                ...l,
                _id: l._id ? l._id.toString() : undefined
            }))
        }
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Navbar for Editor */}
            <div className="h-16 border-b bg-white dark:bg-slate-900 flex items-center justify-between px-6 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <LinkComponent href={`/dashboard/links/${id}`} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </LinkComponent>
                    <div>
                        <h1 className="font-bold text-lg">{link.title || "Untitled Bio Page"}</h1>
                        <p className="text-xs text-muted-foreground">Content Editor</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <LinkComponent href={`/dashboard/links/${id}/editor`} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                        Edit Design
                    </LinkComponent>
                    <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />
                    <LinkComponent href={`/${link.slug}`} target="_blank" className="text-sm font-medium text-indigo-500 hover:text-indigo-400 flex items-center">
                        View Live <ExternalLink className="w-3 h-3 ml-1" />
                    </LinkComponent>
                </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-hidden p-0">
                <BioContentEditor linkId={id} initialData={serializedLink} />
            </div>
        </div>
    );
}

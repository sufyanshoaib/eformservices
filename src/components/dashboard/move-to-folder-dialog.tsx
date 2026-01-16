'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FolderInput } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Folder {
    id: string;
    name: string;
}

interface MoveToFolderDialogProps {
    pdfId: string;
    currentFolderId: string | null;
    folders: Folder[];
}

export function MoveToFolderDialog({ pdfId, currentFolderId, folders }: MoveToFolderDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<string>(currentFolderId || 'root');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const targetFolderId = selectedFolder === 'root' ? null : selectedFolder;

            // Only update if changed
            if (targetFolderId === currentFolderId) {
                setOpen(false);
                setLoading(false);
                return;
            }

            const res = await fetch(`/api/pdfs/${pdfId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folderId: targetFolderId }),
            });

            if (!res.ok) throw new Error('Failed to move PDF');

            toast.success('PDF moved successfully');
            setOpen(false);
            router.refresh();
        } catch (error) {
            toast.error('Something went wrong');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Move to folder" className="h-8 w-8 text-slate-400 hover:text-blue-500">
                    <FolderInput className="h-4 w-4" />
                    <span className="sr-only">Move to folder</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Move PDF</DialogTitle>
                    <DialogDescription>
                        Select a destination folder for this PDF.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="folder" className="text-right">
                                Folder
                            </Label>
                            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select folder" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="root">My Library (Root)</SelectItem>
                                    {folders.map(folder => (
                                        <SelectItem key={folder.id} value={folder.id}>
                                            {folder.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Moving...' : 'Move PDF'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

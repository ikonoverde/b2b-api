import { useForm } from '@inertiajs/react';
import { MessageSquare, Send } from 'lucide-react';
import { FormEvent } from 'react';
import type { AdminOrder } from '@/types';
import { formatDate } from './helpers';

export default function NotesSection({ order }: { order: AdminOrder }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/admin/orders/${order.id}/notes`, {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                    Notas Internas ({order.notes.length})
                </h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <div className="flex-1">
                        <textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            placeholder="Agregar una nota interna..."
                            rows={2}
                            className="w-full px-4 py-3 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary transition-colors resize-none"
                        />
                        {errors.content && (
                            <span className="text-xs text-destructive">{errors.content}</span>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={processing || !data.content.trim()}
                        className="self-end h-10 px-4 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary transition-colors disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>

                {order.notes.map((note) => (
                    <div key={note.id} className="flex gap-3 p-3 bg-background rounded-lg">
                        <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm text-foreground">{note.content}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">{formatDate(note.created_at)}</span>
                                {note.admin_name && (
                                    <span className="text-xs text-muted-foreground">por {note.admin_name}</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

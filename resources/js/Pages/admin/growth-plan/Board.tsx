import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ArrowLeft, CheckCircle2, GripVertical, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { GrowthBoardColumn, GrowthBoardTask, PageProps } from '@/types';
import {
    agentChipClasses,
    agentDescriptions,
    agentLabels,
    boardColumnDescriptions,
    boardColumnLabels,
    closedByLabels,
    formatDate,
} from './helpers';

interface Props extends PageProps {
    columns: Record<GrowthBoardColumn, GrowthBoardTask[]>;
}

const columnOrder: GrowthBoardColumn[] = ['todo', 'in_progress', 'review', 'done'];

function TaskBoardCard({
    task,
    column,
    onDragStart,
    onDragEnd,
}: {
    task: GrowthBoardTask;
    column: GrowthBoardColumn;
    onDragStart: () => void;
    onDragEnd: () => void;
}) {
    return (
        <Card
            draggable
            onDragStart={(event) => {
                event.dataTransfer.setData('text/plain', String(task.id));
                event.dataTransfer.effectAllowed = 'move';
                onDragStart();
            }}
            onDragEnd={onDragEnd}
            onClick={() => router.visit(`/admin/growth-plan/tasks/${task.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    router.visit(`/admin/growth-plan/tasks/${task.id}`);
                }
            }}
            className="cursor-pointer gap-3 border-border bg-card shadow-none transition-shadow select-none hover:shadow-sm active:cursor-grabbing"
        >
            <CardHeader className="gap-2">
                <div className="flex items-start gap-1.5">
                    <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-border" />
                    <CardTitle className="text-sm font-medium text-foreground">
                        {task.name}
                    </CardTitle>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                    {task.action}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
                <p className="line-clamp-3 text-xs leading-relaxed whitespace-pre-line text-muted-foreground">
                    {task.body}
                </p>

                {column === 'review' && task.closure_proposal_reason !== null && (
                    <p className="rounded-md border border-border bg-muted px-2.5 py-2 text-xs text-muted-foreground">
                        {task.closure_proposal_reason}
                    </p>
                )}

                {column === 'done' && task.closed_by !== null && (
                    <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        {task.closed_by === 'human' ? (
                            <User className="h-3 w-3" />
                        ) : (
                            <CheckCircle2 className="h-3 w-3" />
                        )}
                        {closedByLabels[task.closed_by]}
                    </p>
                )}

                <div className="flex flex-wrap items-center gap-1.5">
                    <Badge
                        variant="outline"
                        title={agentDescriptions[task.agent]}
                        className={`${agentChipClasses[task.agent]}`}
                    >
                        {agentLabels[task.agent]}
                    </Badge>
                    {task.source_report !== null && (
                        <span className="text-xs text-muted-foreground">
                            Reporte del {formatDate(task.source_report)}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function BoardColumn({
    column,
    tasks,
    isDragging,
    onDragStart,
    onDragEnd,
}: {
    column: GrowthBoardColumn;
    tasks: GrowthBoardTask[];
    isDragging: boolean;
    onDragStart: () => void;
    onDragEnd: () => void;
}) {
    const [isOver, setIsOver] = useState(false);

    return (
        <section
            onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
                setIsOver(true);
            }}
            onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                    setIsOver(false);
                }
            }}
            onDrop={(event) => {
                event.preventDefault();
                setIsOver(false);

                const taskId = Number(event.dataTransfer.getData('text/plain'));

                if (!Number.isNaN(taskId) && taskId > 0) {
                    router.post(
                        `/admin/growth-plan/tasks/${taskId}/move`,
                        { column },
                        { preserveScroll: true },
                    );
                }
            }}
            className={`flex min-h-[320px] flex-col gap-3 rounded-xl border p-3 transition-colors ${
                isOver
                    ? 'border-primary bg-muted'
                    : isDragging
                      ? 'border-dashed border-muted bg-background'
                      : 'border-border bg-background'
            }`}
        >
            <header
                title={boardColumnDescriptions[column]}
                className="flex items-center justify-between gap-2 px-1"
            >
                <h2 className="text-sm font-semibold text-foreground">
                    {boardColumnLabels[column]}
                </h2>
                <Badge variant="secondary" className="bg-card text-muted-foreground">
                    {tasks.length}
                </Badge>
            </header>

            <div className="flex flex-1 flex-col gap-3">
                {tasks.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border">
                        <p className="text-xs text-muted-foreground">Nada aquí.</p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <TaskBoardCard
                            key={task.id}
                            task={task}
                            column={column}
                            onDragStart={onDragStart}
                            onDragEnd={onDragEnd}
                        />
                    ))
                )}
            </div>
        </section>
    );
}

export default function GrowthPlanBoard() {
    const { columns } = usePage<Props>().props;
    const [isDragging, setIsDragging] = useState(false);

    return (
        <AppLayout title="Tablero de tareas" active="growth-plan">
            <div className="flex flex-col gap-6 p-10 pr-12">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[28px] font-semibold text-foreground">
                            Tablero de tareas
                        </h1>
                        <p className="max-w-2xl text-sm text-muted-foreground">
                            Arrastra una tarjeta para cambiar el estado de la tarea. Soltarla en
                            Hecha la cierra a tu nombre, igual que confirmarla en el plan.
                        </p>
                    </div>
                    <Button asChild variant="outline" className="">
                        <Link href="/admin/growth-plan">
                            <ArrowLeft data-icon="inline-start" />
                            Ver el plan
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {columnOrder.map((column) => (
                        <BoardColumn
                            key={column}
                            column={column}
                            tasks={columns[column]}
                            isDragging={isDragging}
                            onDragStart={() => setIsDragging(true)}
                            onDragEnd={() => setIsDragging(false)}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}

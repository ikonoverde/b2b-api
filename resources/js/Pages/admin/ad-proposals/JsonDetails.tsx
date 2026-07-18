function humanize(key: string): string {
    return key.replace(/[_-]+/g, ' ').replace(/^\w/, (letter) => letter.toUpperCase());
}

function ScalarValue({ value }: { value: string | number | boolean }) {
    return <span className="text-sm text-foreground">{String(value)}</span>;
}

/**
 * Agents fill these JSON columns with whatever shape fits the campaign, so the
 * renderer walks arbitrary nesting instead of assuming named fields.
 */
export function JsonValue({ value, depth = 0 }: { value: unknown; depth?: number }) {
    if (value === null || value === undefined || value === '') {
        return <span className="text-sm text-muted-foreground">—</span>;
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return <ScalarValue value={value} />;
    }

    if (Array.isArray(value)) {
        if (value.every((item) => typeof item === 'string' || typeof item === 'number')) {
            return (
                <div className="flex flex-wrap gap-1.5">
                    {value.map((item, index) => (
                        <span
                            key={index}
                            className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground"
                        >
                            {String(item)}
                        </span>
                    ))}
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-3">
                {value.map((item, index) => (
                    <div key={index} className="rounded-lg border border-border bg-background p-3">
                        <JsonValue value={item} depth={depth + 1} />
                    </div>
                ))}
            </div>
        );
    }

    if (typeof value === 'object') {
        return (
            <dl className="flex flex-col gap-2.5">
                {Object.entries(value as Record<string, unknown>).map(([key, nested]) => (
                    <div key={key} className="flex flex-col gap-1">
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            {humanize(key)}
                        </dt>
                        <dd>
                            <JsonValue value={nested} depth={depth + 1} />
                        </dd>
                    </div>
                ))}
            </dl>
        );
    }

    return <ScalarValue value={String(value)} />;
}

export function DetailCard({
    title,
    value,
    children,
}: {
    title: string;
    value?: unknown;
    children?: React.ReactNode;
}) {
    const isEmpty =
        children === undefined &&
        (value === null ||
            value === undefined ||
            value === '' ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'object' && !Array.isArray(value) && Object.keys(value as object).length === 0));

    if (isEmpty) {
        return null;
    }

    return (
        <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            {children ?? <JsonValue value={value} />}
        </section>
    );
}

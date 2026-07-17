import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type MarkdownProps = {
    children: string;
    components?: Partial<Components>;
} & React.HTMLProps<HTMLDivElement>;

const DEFAULT_COMPONENTS: Partial<Components> = {
    a: ({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) => (
        <a
            {...props}
            href={href}
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
            {children}
        </a>
    ),
};

function Markdown({ children, className, components, ...props }: MarkdownProps) {
    return (
        <div className={cn(className)} {...props}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ ...DEFAULT_COMPONENTS, ...components }}>
                {children}
            </ReactMarkdown>
        </div>
    );
}

export { Markdown };

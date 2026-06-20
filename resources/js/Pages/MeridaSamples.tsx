import { useForm, usePage } from "@inertiajs/react";
import { useEffect, useRef, type FormEvent } from "react";
import PublicShell from "@/Layouts/PublicShell";
import type { PageProps } from "@/types";

interface MeridaSampleOptions {
    businessTypes: string[];
    clientVolumes: string[];
    products: string[];
    improvementGoals: string[];
}

interface MeridaSamplesProps extends PageProps {
    options: MeridaSampleOptions;
}

interface MeridaSampleForm {
    business_name: string;
    contact_name: string;
    email: string;
    phone: string;
    business_type: string;
    client_volume: string;
    social_url: string;
    products_interested: string[];
    improvement_goals: string[];
}

export default function MeridaSamples({ options }: MeridaSamplesProps) {
    const { flash } = usePage<PageProps>().props;
    const successMessageRef = useRef<HTMLDivElement>(null);
    const form = useForm<MeridaSampleForm>({
        business_name: "",
        contact_name: "",
        email: "",
        phone: "",
        business_type: "",
        client_volume: "",
        social_url: "",
        products_interested: [],
        improvement_goals: [],
    });

    useEffect(() => {
        if (flash.success) {
            const timeout = window.setTimeout(() => {
                successMessageRef.current?.scrollIntoView({ block: "start" });
            });

            return () => window.clearTimeout(timeout);
        }
    }, [flash.success]);

    function submit(event: FormEvent): void {
        event.preventDefault();

        form.post("/muestras-gratis-merida", {
            onSuccess: () => form.reset(),
        });
    }

    function toggleArrayValue(
        field: "products_interested" | "improvement_goals",
        value: string,
    ): void {
        const values = form.data[field];

        form.setData(
            field,
            values.includes(value)
                ? values.filter((item) => item !== value)
                : [...values, value],
        );
    }

    return (
        <PublicShell title="Muestras gratis para negocios en Mérida">
            <section className="py-16 sm:py-20 lg:py-24">
                <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
                    <header className="lg:sticky lg:top-10 lg:self-start">
                        <p className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent-ink)] uppercase">
                            Mérida · Yucatán
                        </p>
                        <h1 className="mt-6 max-w-[12ch] font-display text-[clamp(2.45rem,5.4vw,4.75rem)] leading-[0.98] tracking-[-0.025em] text-[var(--iko-stone-ink)]">
                            Muestras para cabina profesional.
                        </h1>
                        <p className="mt-7 max-w-[50ch] text-[16px] leading-[1.7] text-[var(--iko-stone-ink)]/75">
                            Programa local para negocios de bienestar en Mérida.
                            El cuestionario nos ayuda a validar el tipo de
                            servicio, volumen de uso y productos que vale la
                            pena enviar para prueba.
                        </p>
                        <dl className="mt-10 grid gap-px border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-hairline)] sm:grid-cols-3 lg:grid-cols-1">
                            <SpecFact label="Costo" value="Sin cargo" />
                            <SpecFact label="Zona" value="Mérida" />
                        </dl>
                    </header>

                    <form
                        onSubmit={submit}
                        className="border-t border-[var(--iko-accent-line)] pt-8"
                    >
                        {flash.success && (
                            <div
                                ref={successMessageRef}
                                className="mb-8 border border-[var(--iko-accent-line)] bg-[var(--iko-accent-mist)] px-5 py-4 text-[var(--iko-accent-ink)]"
                            >
                                <p className="font-spec text-[11px] tracking-[0.08em] uppercase">
                                    Solicitud enviada
                                </p>
                                <p className="mt-2 text-[14px] leading-[1.6]">
                                    {flash.success}
                                </p>
                            </div>
                        )}

                        <div className="grid gap-10">
                            <section
                                aria-labelledby="contact-heading"
                                className="grid gap-6"
                            >
                                <SectionLabel
                                    index="01"
                                    title="Datos de seguimiento"
                                    headingId="contact-heading"
                                />
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <TextField
                                        id="business_name"
                                        label="Nombre del negocio"
                                        value={form.data.business_name}
                                        error={form.errors.business_name}
                                        required
                                        onChange={(value) =>
                                            form.setData("business_name", value)
                                        }
                                    />
                                    <TextField
                                        id="contact_name"
                                        label="Nombre de contacto"
                                        value={form.data.contact_name}
                                        error={form.errors.contact_name}
                                        required
                                        onChange={(value) =>
                                            form.setData("contact_name", value)
                                        }
                                    />
                                    <TextField
                                        id="email"
                                        label="Correo"
                                        type="email"
                                        value={form.data.email}
                                        error={form.errors.email}
                                        required
                                        onChange={(value) =>
                                            form.setData("email", value)
                                        }
                                    />
                                    <TextField
                                        id="phone"
                                        label="Teléfono"
                                        type="tel"
                                        value={form.data.phone}
                                        error={form.errors.phone}
                                        onChange={(value) =>
                                            form.setData("phone", value)
                                        }
                                    />
                                </div>
                            </section>

                            <RadioGroup
                                index="02"
                                name="business_type"
                                title="¿Cuál es tu tipo de negocio?"
                                options={options.businessTypes}
                                value={form.data.business_type}
                                error={form.errors.business_type}
                                onChange={(value) =>
                                    form.setData("business_type", value)
                                }
                            />

                            <RadioGroup
                                index="03"
                                name="client_volume"
                                title="¿Cuál es tu volumen de clientes o consumo mensual aproximado?"
                                options={options.clientVolumes}
                                value={form.data.client_volume}
                                error={form.errors.client_volume}
                                onChange={(value) =>
                                    form.setData("client_volume", value)
                                }
                            />

                            <section
                                aria-labelledby="social-heading"
                                className="grid gap-6"
                            >
                                <SectionLabel
                                    index="04"
                                    title="Sitio web o enlace a sus redes sociales"
                                    headingId="social-heading"
                                />
                                <TextField
                                    id="social_url"
                                    label="URL (opcional, recomendado)"
                                    type="url"
                                    value={form.data.social_url}
                                    error={form.errors.social_url}
                                    placeholder="https://instagram.com/tu-negocio"
                                    onChange={(value) =>
                                        form.setData("social_url", value)
                                    }
                                />
                            </section>

                            <CheckboxGroup
                                index="05"
                                name="products_interested"
                                title="¿Qué producto de nuestra línea te interesa probar más?"
                                options={options.products}
                                values={form.data.products_interested}
                                error={form.errors.products_interested}
                                onChange={(value) =>
                                    toggleArrayValue(
                                        "products_interested",
                                        value,
                                    )
                                }
                            />

                            <CheckboxGroup
                                index="06"
                                name="improvement_goals"
                                title="¿Qué buscas mejorar en tus insumos actuales?"
                                options={options.improvementGoals}
                                values={form.data.improvement_goals}
                                error={form.errors.improvement_goals}
                                onChange={(value) =>
                                    toggleArrayValue("improvement_goals", value)
                                }
                            />
                        </div>

                        <div className="mt-10 border-t border-[var(--iko-stone-hairline)] pt-8">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex h-12 w-full items-center justify-center bg-[var(--iko-accent)] px-7 text-[14px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] transition-colors hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                                {form.processing
                                    ? "Enviando solicitud..."
                                    : "Enviar solicitud de muestras"}
                            </button>
                            <p className="mt-4 max-w-[58ch] text-[13px] leading-[1.6] text-[var(--iko-stone-whisper)]">
                                Enviar este formulario no garantiza el envío de
                                muestras. Revisaremos disponibilidad, zona y
                                compatibilidad con el tipo de servicio.
                            </p>
                        </div>
                    </form>
                </div>
            </section>
        </PublicShell>
    );
}

function SpecFact({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-[var(--iko-stone-surface)] px-5 py-4">
            <dt className="font-spec text-[10px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                {label}
            </dt>
            <dd className="mt-2 font-display text-[1.25rem] leading-tight text-[var(--iko-stone-ink)]">
                {value}
            </dd>
        </div>
    );
}

function SectionLabel({
    index,
    title,
    headingId,
}: {
    index: string;
    title: string;
    headingId: string;
}) {
    return (
        <div className="grid gap-3 sm:grid-cols-[3rem_1fr] sm:items-baseline">
            <span className="font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-accent-ink)]">
                {index}
            </span>
            <h2
                id={headingId}
                className="font-display text-[1.45rem] leading-[1.12] text-[var(--iko-stone-ink)]"
            >
                {title}
            </h2>
        </div>
    );
}

function TextField({
    id,
    label,
    value,
    onChange,
    type = "text",
    error,
    placeholder,
    required = false,
}: {
    id: keyof MeridaSampleForm;
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: "text" | "email" | "tel" | "url";
    error?: string;
    placeholder?: string;
    required?: boolean;
}) {
    return (
        <div className="grid gap-2">
            <label
                htmlFor={id}
                className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase"
            >
                {label}
                {required && (
                    <span aria-hidden="true" className="ml-1 opacity-50">
                        *
                    </span>
                )}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                value={value}
                placeholder={placeholder}
                required={required}
                onChange={(event) => onChange(event.target.value)}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`h-12 border-b bg-transparent font-sans text-[15px] text-[var(--iko-stone-ink)] transition-colors placeholder:text-[var(--iko-stone-whisper)] focus-visible:border-[var(--iko-accent)] focus-visible:outline-none ${
                    error
                        ? "border-[var(--iko-error)]"
                        : "border-[var(--iko-stone-hairline)]"
                }`}
            />
            <FieldError id={`${id}-error`} error={error} />
        </div>
    );
}

function RadioGroup({
    index,
    name,
    title,
    options,
    value,
    error,
    onChange,
}: {
    index: string;
    name: "business_type" | "client_volume";
    title: string;
    options: string[];
    value: string;
    error?: string;
    onChange: (value: string) => void;
}) {
    const headingId = `${name}-heading`;

    return (
        <section aria-labelledby={headingId} className="grid gap-6">
            <SectionLabel index={index} title={title} headingId={headingId} />
            <div className="grid gap-px border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-hairline)]">
                {options.map((option) => (
                    <label
                        key={option}
                        className="flex cursor-pointer items-center gap-4 bg-[var(--iko-stone-surface)] px-4 py-4 transition-colors hover:bg-[var(--iko-accent-soft)]"
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option}
                            checked={value === option}
                            onChange={() => onChange(option)}
                            className="h-4 w-4 accent-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-surface)]"
                        />
                        <span className="text-[14px] leading-[1.45] text-[var(--iko-stone-ink)]">
                            {option}
                        </span>
                    </label>
                ))}
            </div>
            <FieldError id={`${name}-error`} error={error} />
        </section>
    );
}

function CheckboxGroup({
    index,
    name,
    title,
    options,
    values,
    error,
    onChange,
}: {
    index: string;
    name: "products_interested" | "improvement_goals";
    title: string;
    options: string[];
    values: string[];
    error?: string;
    onChange: (value: string) => void;
}) {
    const headingId = `${name}-heading`;

    return (
        <section aria-labelledby={headingId} className="grid gap-6">
            <SectionLabel index={index} title={title} headingId={headingId} />
            <div className="grid gap-px border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-hairline)] sm:grid-cols-2">
                {options.map((option) => (
                    <label
                        key={option}
                        className="flex cursor-pointer items-center gap-4 bg-[var(--iko-stone-surface)] px-4 py-4 transition-colors hover:bg-[var(--iko-accent-soft)]"
                    >
                        <input
                            type="checkbox"
                            name={`${name}[]`}
                            value={option}
                            checked={values.includes(option)}
                            onChange={() => onChange(option)}
                            className="h-4 w-4 accent-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-surface)]"
                        />
                        <span className="text-[14px] leading-[1.45] text-[var(--iko-stone-ink)]">
                            {option}
                        </span>
                    </label>
                ))}
            </div>
            <FieldError id={`${name}-error`} error={error} />
        </section>
    );
}

function FieldError({ id, error }: { id: string; error?: string }) {
    if (!error) {
        return null;
    }

    return (
        <p
            id={id}
            className="font-spec text-[11px] tracking-[0.04em] text-[var(--iko-error)]"
        >
            {error}
        </p>
    );
}

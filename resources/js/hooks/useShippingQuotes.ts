import axios from 'axios';
import { useRef, useState } from 'react';
import type { ShippingQuote } from '@/types';

interface QuoteAddress {
    postal_code: string;
    city: string;
    state: string;
    neighborhood: string;
}

export default function useShippingQuotes() {
    const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fetched, setFetched] = useState(false);

    const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
    const abortRef = useRef<AbortController>(null);

    function fetch(address: QuoteAddress) {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            setLoading(true);
            setError(null);
            setFetched(false);
            setQuotes([]);

            try {
                const { data } = await axios.post('/checkout/shipping-quotes', address, {
                    signal: controller.signal,
                });

                const fetchedQuotes: ShippingQuote[] = data.quotes ?? [];
                setQuotes(fetchedQuotes);
                setFetched(true);

                if (fetchedQuotes.length === 0) {
                    setError('No encontramos opciones de envío para este código postal.');
                }
            } catch (err) {
                if (axios.isCancel(err)) {
                    return;
                }
                setError('No pudimos obtener opciones de envío. Verifica tu código postal.');
                setFetched(true);
            } finally {
                setLoading(false);
            }
        }, 600);
    }

    return { quotes, loading, error, fetched, fetch };
}

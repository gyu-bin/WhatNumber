import { useEffect, useMemo } from 'react';

interface JsonLdProps {
  id: string;
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ id, data }: JsonLdProps) {
  const serialized = useMemo(() => JSON.stringify(data), [data]);

  useEffect(() => {
    const scriptId = `jsonld-${id}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = serialized;

    return () => {
      script?.remove();
    };
  }, [id, serialized]);

  return null;
}

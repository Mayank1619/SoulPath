declare module "@vercel/node" {
    export interface VercelRequest {
        url?: string;
        method?: string;
        headers: Record<string, string | string[] | undefined>;
        body?: unknown;
    }

    export interface VercelResponse {
        statusCode: number;
        setHeader: (key: string, value: string) => void;
        end: (body?: string) => void;
    }
}

import axios, { AxiosError } from "axios";
import { OpenAlexQueryParams } from "./types.js";

const OPENALEX_BASE_URL = "https://api.openalex.org";
const MAX_ERROR_DETAIL_LENGTH = 1000;

/**
 * Helper function to build query string from parameters
 */
export function buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });
    return searchParams.toString();
}

/**
 * Helper function to make OpenAlex API requests
 */
export async function makeOpenAlexRequest(endpoint: string, params: OpenAlexQueryParams = {}): Promise<any> {
    const queryString = buildQueryString(params);
    const url = `${OPENALEX_BASE_URL}${endpoint}${queryString ? '?' + queryString : ''}`;
    try {
        // Build User-Agent with mailto for polite pool access
        let userAgent = 'OpenAlex-MCP-Server/1.0.0 (https://github.com/openalex-mcp-server)';
        if (params.mailto) {
            userAgent += ` mailto:${params.mailto}`;
        }
        else {
            // Use environment variable for default email
            const defaultEmail = process.env.OPENALEX_DEFAULT_EMAIL || 'mcp-server@example.com';
            userAgent += ` mailto:${defaultEmail}`;
        }

        // Build headers
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'User-Agent': userAgent
        };

        // Add Bearer token - check parameter first, then environment variable
        const bearerToken = params.bearer_token || process.env.OPENALEX_BEARER_TOKEN;
        if (bearerToken) {
            headers['Authorization'] = `Bearer ${bearerToken}`;
        }

        const response = await axios.get(url, {
            headers,
            timeout: 30000
        });
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(formatOpenAlexError(error));
        }
        throw error;
    }
}

/**
 * Extract a human-readable reason from an OpenAlex error response body.
 * OpenAlex returns JSON like {"error": "...", "message": "..."} for bad queries
 * and a small HTML page for unknown URLs.
 */
function describeErrorBody(body: unknown): string {
    if (typeof body === 'string') {
        return body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }
    if (body && typeof body === 'object') {
        const { error, message } = body as { error?: unknown; message?: unknown };
        const parts = [error, message].filter((part): part is string => typeof part === 'string' && part.length > 0);
        return parts.length > 0 ? parts.join(' ') : JSON.stringify(body);
    }
    return '';
}

/**
 * Build the error message for a failed OpenAlex request, keeping the reason
 * OpenAlex gave so that callers can correct their query.
 */
function formatOpenAlexError(error: AxiosError): string {
    if (!error.response) {
        return `OpenAlex API error: ${error.message}`;
    }
    const { status, statusText, data } = error.response;
    let message = `OpenAlex API error: ${status} - ${statusText || error.message}`;
    let detail = describeErrorBody(data);
    if (detail.length > MAX_ERROR_DETAIL_LENGTH) {
        detail = `${detail.slice(0, MAX_ERROR_DETAIL_LENGTH)}…`;
    }
    if (detail) {
        message += `: ${detail}`;
    }
    if (status === 429) {
        message += ' (rate limited: wait and retry; passing `mailto` or `api_key` raises the limit)';
    }
    return message;
}

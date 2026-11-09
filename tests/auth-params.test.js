import { test, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import axios from 'axios';
import { getEntity } from '../build/tools/getEntity.js';
import { classifyText } from '../build/tools/classifyText.js';
import { searchWorks } from '../build/tools/searchWorks.js';
import { listTools } from './helpers.js';

function captureRequests() {
    const calls = [];
    mock.method(axios, 'get', async (url, config) => {
        calls.push({ url: new URL(url), headers: config.headers });
        return { data: { results: [] } };
    });
    return calls;
}

afterEach(() => {
    mock.restoreAll();
    delete process.env.OPENALEX_BEARER_TOKEN;
});

test('get_entity forwards api_key as a query parameter', async () => {
    const calls = captureRequests();
    await getEntity({ entity_type: 'works', openalex_id: 'W2741809807', api_key: 'test-key' });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url.pathname, '/works/W2741809807');
    assert.equal(calls[0].url.searchParams.get('api_key'), 'test-key');
});

test('get_entity forwards bearer_token as an Authorization header', async () => {
    const calls = captureRequests();
    await getEntity({ entity_type: 'authors', openalex_id: 'A1969205038', bearer_token: 'test-token' });
    assert.equal(calls[0].headers['Authorization'], 'Bearer test-token');
});

test('classify_text forwards api_key and bearer_token', async () => {
    const calls = captureRequests();
    await classifyText({ title: 'Deep learning', api_key: 'test-key', bearer_token: 'test-token' });
    assert.equal(calls[0].url.pathname, '/text');
    assert.equal(calls[0].url.searchParams.get('title'), 'Deep learning');
    assert.equal(calls[0].url.searchParams.get('api_key'), 'test-key');
    assert.equal(calls[0].headers['Authorization'], 'Bearer test-token');
});

test('bearer_token is sent only as a header, never in the URL', async () => {
    const calls = captureRequests();
    await searchWorks({ search: 'ai', api_key: 'test-key', bearer_token: 'test-token' });
    assert.equal(calls[0].url.searchParams.get('api_key'), 'test-key');
    assert.equal(calls[0].url.searchParams.has('bearer_token'), false);
    assert.equal(calls[0].headers['Authorization'], 'Bearer test-token');
});

test('OPENALEX_BEARER_TOKEN is used when no bearer_token argument is given', async () => {
    process.env.OPENALEX_BEARER_TOKEN = 'env-token';
    const calls = captureRequests();
    await getEntity({ entity_type: 'works', openalex_id: 'W2741809807' });
    assert.equal(calls[0].headers['Authorization'], 'Bearer env-token');
});

test('every API-backed tool declares api_key and bearer_token in its input schema', async () => {
    const tools = await listTools();
    const apiTools = tools.filter((t) => t.name !== 'get_filterable_fields');
    assert.equal(apiTools.length, 10);
    for (const t of apiTools) {
        assert.ok(t.inputSchema.properties.api_key, `${t.name} is missing api_key`);
        assert.ok(t.inputSchema.properties.bearer_token, `${t.name} is missing bearer_token`);
    }
});

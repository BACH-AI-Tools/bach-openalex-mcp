import { test, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import axios, { AxiosError } from 'axios';
import { makeOpenAlexRequest } from '../build/utils.js';

function rejectWith(status, statusText, data) {
    mock.method(axios, 'get', async (url, config) => {
        const response = { status, statusText, data, headers: {}, config };
        throw new AxiosError(`Request failed with status code ${status}`, AxiosError.ERR_BAD_REQUEST, config, null, response);
    });
}

afterEach(() => mock.restoreAll());

test('400 errors include the reason from the OpenAlex JSON body', async () => {
    rejectWith(400, 'Bad Request', {
        error: 'Invalid query parameters error.',
        message: 'Value for param from_publication_date is an invalid date. Format is yyyy-mm-dd (e.g. 2020-05-17).'
    });
    await assert.rejects(
        makeOpenAlexRequest('/works', { filter: 'from_publication_date:2023-13-45' }),
        (error) => {
            assert.match(error.message, /^OpenAlex API error: 400 - Bad Request/);
            assert.match(error.message, /from_publication_date is an invalid date/);
            return true;
        }
    );
});

test('HTML error bodies are reduced to their text', async () => {
    rejectWith(404, '', '<!doctype html>\n<html lang=en>\n<title>404 Not Found</title>\n<h1>Not Found</h1>\n<p>The requested URL was not found on the server.</p>\n');
    await assert.rejects(makeOpenAlexRequest('/works/W0'), (error) => {
        assert.match(error.message, /^OpenAlex API error: 404/);
        assert.match(error.message, /The requested URL was not found on the server\./);
        assert.doesNotMatch(error.message, /<[a-z]/i);
        return true;
    });
});

test('very long error bodies are truncated', async () => {
    rejectWith(400, 'Bad Request', { error: 'Invalid query parameters error.', message: 'x'.repeat(5000) });
    await assert.rejects(makeOpenAlexRequest('/works', { filter: 'foo:bar' }), (error) => {
        assert.ok(error.message.length < 1200, `message length ${error.message.length}`);
        assert.match(error.message, /…$/);
        return true;
    });
});

test('429 errors include an actionable hint', async () => {
    rejectWith(429, 'Too Many Requests', { error: 'Rate limit exceeded' });
    await assert.rejects(makeOpenAlexRequest('/works'), (error) => {
        assert.match(error.message, /^OpenAlex API error: 429/);
        assert.match(error.message, /Rate limit exceeded/);
        assert.match(error.message, /mailto/);
        return true;
    });
});

test('network errors without a response do not print "undefined"', async () => {
    mock.method(axios, 'get', async (url, config) => {
        throw new AxiosError('timeout of 30000ms exceeded', AxiosError.ECONNABORTED, config, {});
    });
    await assert.rejects(makeOpenAlexRequest('/works'), (error) => {
        assert.doesNotMatch(error.message, /undefined/);
        assert.match(error.message, /timeout of 30000ms exceeded/);
        return true;
    });
});

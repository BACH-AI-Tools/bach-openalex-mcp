import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getFilterableFields } from '../build/tools/getFilterableFields.js';

const ENTITY_TYPES = ['works', 'authors', 'sources', 'institutions', 'topics', 'publishers', 'funders'];
const validFields = JSON.parse(readFileSync(new URL('./fixtures/openalex-filter-fields.json', import.meta.url), 'utf8'));

async function fieldsFor(entity_type) {
    const result = await getFilterableFields({ entity_type });
    return JSON.parse(result.content[0].text);
}

for (const entity_type of ENTITY_TYPES) {
    test(`${entity_type}: lists a useful set of common filters`, async () => {
        const result = await fieldsFor(entity_type);
        assert.equal(result.entity_type, entity_type);
        assert.ok(Array.isArray(result.fields));
        const minimum = entity_type === 'topics' ? 8 : 10;
        assert.ok(result.fields.length >= minimum, `${entity_type} lists only ${result.fields.length} fields`);
    });

    test(`${entity_type}: every listed field is accepted by OpenAlex`, async () => {
        const { fields } = await fieldsFor(entity_type);
        for (const field of fields) {
            assert.ok(validFields[entity_type].includes(field.name), `${entity_type}: "${field.name}" is not a valid OpenAlex filter`);
            assert.ok(field.type && field.category && field.description, `${entity_type}: "${field.name}" is missing metadata`);
        }
    });

    test(`${entity_type}: says the list is not exhaustive and where to find the rest`, async () => {
        const result = await fieldsFor(entity_type);
        assert.equal(result.complete, false);
        assert.match(result.note, /docs\.openalex\.org/);
    });
}

test('unknown entity types are rejected', async () => {
    await assert.rejects(getFilterableFields({ entity_type: 'concepts' }), /Unknown entity_type/);
});

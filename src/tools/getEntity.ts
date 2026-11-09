import { makeOpenAlexRequest } from "../utils.js";

export async function getEntity(args: any) {
    const { entity_type, openalex_id, select, mailto, api_key, bearer_token } = args;
    const params: Record<string, any> = {};
    if (select)
        params.select = select;
    if (mailto)
        params.mailto = mailto;
    if (api_key)
        params.api_key = api_key;
    if (bearer_token)
        params.bearer_token = bearer_token;
    return {
        content: [{
                type: "text",
                text: JSON.stringify(await makeOpenAlexRequest(`/${entity_type}/${openalex_id}`, params), null, 2)
            }]
    };
}
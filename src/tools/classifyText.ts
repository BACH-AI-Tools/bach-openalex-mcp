import { makeOpenAlexRequest } from "../utils.js";

export async function classifyText(args: any) {
    const { title, abstract, mailto, api_key, bearer_token } = args;
    const params: Record<string, any> = {};
    if (title)
        params.title = title;
    if (abstract)
        params.abstract = abstract;
    if (mailto)
        params.mailto = mailto;
    if (api_key)
        params.api_key = api_key;
    if (bearer_token)
        params.bearer_token = bearer_token;
    return {
        content: [{
                type: "text",
                text: JSON.stringify(await makeOpenAlexRequest("/text", params), null, 2)
            }]
    };
}
import { EntityType } from "../types.js";

const FILTER_DOCS_URL = "https://docs.openalex.org/how-to-use-the-api/get-lists-of-entities/filter-entity-lists";

export async function getFilterableFields(args: any) {
    const { entity_type } = args as { entity_type: EntityType | string };
    let fields: any[] = [];
    switch (entity_type) {
        case "works":
            fields = [
                // Attribute Filters from Work object
                { name: "authorships.author.id", type: "string", category: "attribute", description: "OpenAlex ID of an author." },
                { name: "authorships.author.orcid", type: "string", category: "attribute", description: "ORCID of an author." },
                { name: "authorships.countries", type: "string", category: "attribute", description: "Country codes associated with author affiliations." },
                { name: "authorships.institutions.id", type: "string", category: "attribute", description: "OpenAlex ID of an author's institution." },
                { name: "apc_paid.value_usd", type: "number", category: "attribute", description: "APC paid value in USD." },
                { name: "best_oa_location.license", type: "string", category: "attribute", description: "License of the best OA location." },
                { name: "biblio.volume", type: "string", category: "attribute", description: "Volume number." },
                { name: "cited_by_count", type: "integer", category: "attribute", description: "Total number of times this work has been cited." },
                { name: "concepts.id", type: "string", category: "attribute", description: "OpenAlex ID of an associated concept/topic." },
                { name: "doi", type: "string", category: "attribute", description: "Digital Object Identifier of the work." },
                { name: "has_fulltext", type: "boolean", category: "attribute", description: "Indicates if full text is available via OpenAlex." },
                { name: "ids.openalex", type: "string", category: "attribute", description: "OpenAlex ID of the work." },
                { name: "ids.pmid", type: "string", category: "attribute", description: "PubMed ID of the work." },
                { name: "is_paratext", type: "boolean", category: "attribute", description: "Indicates if the work is paratext (e.g., cover, table of contents)." },
                { name: "is_retracted", type: "boolean", category: "attribute", description: "Indicates if the work has been retracted." },
                { name: "language", type: "string", category: "attribute", description: "Language code of the work." },
                { name: "locations.is_oa", type: "boolean", category: "attribute", description: "Indicates if a specific location is Open Access." },
                { name: "open_access.is_oa", type: "boolean", category: "attribute", description: "Overall Open Access status of the work." },
                { name: "open_access.oa_status", type: "string", category: "attribute", description: "OA status (e.g., gold, green, hybrid)." },
                { name: "primary_location.source.id", type: "string", category: "attribute", description: "OpenAlex ID of the primary hosting source." },
                { name: "publication_year", type: "integer", category: "attribute", description: "Year of publication." },
                { name: "publication_date", type: "date", category: "attribute", description: "Full publication date (YYYY-MM-DD)." },
                { name: "type", type: "string", category: "attribute", description: "Type of the work (e.g., article, book)." },
                // Convenience Filters for Works
                { name: "abstract.search", type: "string", category: "convenience", description: "Full-text search within the work's abstract." },
                { name: "authors_count", type: "integer", category: "convenience", description: "Number of authors for the work." },
                { name: "cited_by", type: "string", category: "convenience", description: "Works cited by the given work ID, i.e. that work's references (outgoing citations)." },
                { name: "cites", type: "string", category: "convenience", description: "Works that cite the given work ID (incoming citations)." },
                { name: "display_name.search", type: "string", category: "convenience", description: "Full-text search within the work's title (alias: title.search)." },
                { name: "from_publication_date", type: "date", category: "convenience", description: "Filter for works published on or after this date." },
                { name: "to_publication_date", type: "date", category: "convenience", description: "Filter for works published on or before this date." },
                { name: "has_abstract", type: "boolean", category: "convenience", description: "Indicates if the work has an abstract." },
                { name: "has_doi", type: "boolean", category: "convenience", description: "Indicates if the work has a DOI." },
            ];
            break;
        case "authors":
            fields = [
                { name: "ids.openalex", type: "string", category: "attribute", description: "OpenAlex ID of the author." },
                { name: "orcid", type: "string", category: "attribute", description: "Author's ORCID iD." },
                { name: "display_name.search", type: "string", category: "convenience", description: "Search by author's display name." },
                { name: "has_orcid", type: "boolean", category: "convenience", description: "Indicates if the author has an ORCID iD." },
                { name: "last_known_institutions.id", type: "string", category: "attribute", description: "OpenAlex ID of the author's last known institution." },
                { name: "last_known_institutions.ror", type: "string", category: "attribute", description: "ROR ID of the author's last known institution." },
                { name: "last_known_institutions.country_code", type: "string", category: "attribute", description: "Country code of the author's last known institution." },
                { name: "last_known_institutions.type", type: "string", category: "attribute", description: "Type of the author's last known institution (e.g., education, company)." },
                { name: "affiliations.institution.id", type: "string", category: "attribute", description: "OpenAlex ID of any institution the author has been affiliated with." },
                { name: "affiliations.institution.country_code", type: "string", category: "attribute", description: "Country code of any institution the author has been affiliated with." },
                { name: "topics.id", type: "string", category: "attribute", description: "OpenAlex ID of a topic the author works on." },
                { name: "works_count", type: "integer", category: "attribute", description: "Number of works by the author." },
                { name: "cited_by_count", type: "integer", category: "attribute", description: "Total number of citations to the author's works." },
                { name: "summary_stats.h_index", type: "integer", category: "attribute", description: "Author's h-index." },
                { name: "summary_stats.i10_index", type: "integer", category: "attribute", description: "Author's i10-index." },
                { name: "summary_stats.2yr_mean_citedness", type: "number", category: "attribute", description: "Mean citations per work over the last two years." }
            ];
            break;
        case "sources":
            fields = [
                { name: "ids.openalex", type: "string", category: "attribute", description: "OpenAlex ID of the source." },
                { name: "issn", type: "string", category: "attribute", description: "Source's ISSN." },
                { name: "issn_l", type: "string", category: "attribute", description: "Source's linking ISSN (ISSN-L)." },
                { name: "display_name.search", type: "string", category: "convenience", description: "Search by source's display name." },
                { name: "type", type: "string", category: "attribute", description: "Type of the source (e.g., journal, repository, conference, ebook platform)." },
                { name: "is_oa", type: "boolean", category: "attribute", description: "If the source is fully OA." },
                { name: "is_in_doaj", type: "boolean", category: "attribute", description: "If the source is listed in the Directory of Open Access Journals." },
                { name: "is_core", type: "boolean", category: "attribute", description: "If the source is a CWTS core source." },
                { name: "has_issn", type: "boolean", category: "convenience", description: "Indicates if the source has an ISSN." },
                { name: "host_organization", type: "string", category: "attribute", description: "OpenAlex ID of the publisher or institution hosting the source." },
                { name: "country_code", type: "string", category: "attribute", description: "Country code of the source." },
                { name: "apc_usd", type: "integer", category: "attribute", description: "Article processing charge in USD." },
                { name: "topics.id", type: "string", category: "attribute", description: "OpenAlex ID of a topic the source publishes on." },
                { name: "works_count", type: "integer", category: "attribute", description: "Number of works in the source." },
                { name: "cited_by_count", type: "integer", category: "attribute", description: "Total number of citations to works in the source." },
                { name: "summary_stats.h_index", type: "integer", category: "attribute", description: "Source's h-index." },
                { name: "summary_stats.2yr_mean_citedness", type: "number", category: "attribute", description: "Mean citations per work over the last two years (similar to impact factor)." }
            ];
            break;
        case "institutions":
            fields = [
                { name: "ids.openalex", type: "string", category: "attribute", description: "OpenAlex ID of the institution." },
                { name: "ror", type: "string", category: "attribute", description: "Institution's ROR ID." },
                { name: "display_name.search", type: "string", category: "convenience", description: "Search by institution's display name." },
                { name: "has_ror", type: "boolean", category: "convenience", description: "Indicates if the institution has a ROR ID." },
                { name: "country_code", type: "string", category: "attribute", description: "Institution's country code." },
                { name: "continent", type: "string", category: "attribute", description: "Continent of the institution." },
                { name: "type", type: "string", category: "attribute", description: "Type of the institution (e.g., education, healthcare, company)." },
                { name: "lineage", type: "string", category: "attribute", description: "OpenAlex ID of the institution or any of its parent institutions." },
                { name: "is_global_south", type: "boolean", category: "attribute", description: "If the institution is located in the Global South." },
                { name: "repositories.id", type: "string", category: "attribute", description: "OpenAlex ID of a repository hosted by the institution." },
                { name: "topics.id", type: "string", category: "attribute", description: "OpenAlex ID of a topic the institution works on." },
                { name: "works_count", type: "integer", category: "attribute", description: "Number of works affiliated with the institution." },
                { name: "cited_by_count", type: "integer", category: "attribute", description: "Total number of citations to the institution's works." },
                { name: "summary_stats.h_index", type: "integer", category: "attribute", description: "Institution's h-index." }
            ];
            break;
        case "topics":
            fields = [
                { name: "ids.openalex", type: "string", category: "attribute", description: "OpenAlex ID of the topic." },
                { name: "display_name.search", type: "string", category: "convenience", description: "Search by topic's display name." },
                { name: "description.search", type: "string", category: "convenience", description: "Search within the topic's description." },
                { name: "keywords.search", type: "string", category: "convenience", description: "Search within the topic's keywords." },
                { name: "domain.id", type: "string", category: "attribute", description: "ID of the topic's domain." },
                { name: "field.id", type: "string", category: "attribute", description: "ID of the topic's field." },
                { name: "subfield.id", type: "string", category: "attribute", description: "ID of the topic's subfield." },
                { name: "works_count", type: "integer", category: "attribute", description: "Number of works tagged with the topic." },
                { name: "cited_by_count", type: "integer", category: "attribute", description: "Total number of citations to works tagged with the topic." }
            ];
            break;
        case "publishers":
            fields = [
                { name: "ids.openalex", type: "string", category: "attribute", description: "OpenAlex ID of the publisher." },
                { name: "ror", type: "string", category: "attribute", description: "Publisher's ROR ID." },
                { name: "display_name.search", type: "string", category: "convenience", description: "Search by publisher's display name." },
                { name: "country_codes", type: "string", category: "attribute", description: "Publisher's country codes." },
                { name: "continent", type: "string", category: "attribute", description: "Continent of the publisher." },
                { name: "hierarchy_level", type: "integer", category: "attribute", description: "Level in the publisher hierarchy (0 = top-level parent)." },
                { name: "parent_publisher", type: "string", category: "attribute", description: "OpenAlex ID of the parent publisher." },
                { name: "lineage", type: "string", category: "attribute", description: "OpenAlex ID of the publisher or any of its parent publishers." },
                { name: "works_count", type: "integer", category: "attribute", description: "Number of works published." },
                { name: "cited_by_count", type: "integer", category: "attribute", description: "Total number of citations to the publisher's works." },
                { name: "summary_stats.h_index", type: "integer", category: "attribute", description: "Publisher's h-index." }
            ];
            break;
        case "funders":
            fields = [
                { name: "ids.openalex", type: "string", category: "attribute", description: "OpenAlex ID of the funder." },
                { name: "ror", type: "string", category: "attribute", description: "Funder's ROR ID." },
                { name: "display_name.search", type: "string", category: "convenience", description: "Search by funder's display name." },
                { name: "description.search", type: "string", category: "convenience", description: "Search within the funder's description." },
                { name: "country_code", type: "string", category: "attribute", description: "Funder's country code." },
                { name: "continent", type: "string", category: "attribute", description: "Continent of the funder." },
                { name: "is_global_south", type: "boolean", category: "attribute", description: "If the funder is located in the Global South." },
                { name: "awards_count", type: "integer", category: "attribute", description: "Number of awards (grants) made by the funder." },
                { name: "works_count", type: "integer", category: "attribute", description: "Number of works linked to the funder." },
                { name: "cited_by_count", type: "integer", category: "attribute", description: "Total number of citations to works linked to the funder." },
                { name: "summary_stats.h_index", type: "integer", category: "attribute", description: "Funder's h-index." }
            ];
            break;
        default:
            throw new Error(`Unknown entity_type for get_filterable_fields: ${entity_type}`);
    }
    return {
        content: [{
            type: "text",
            text: JSON.stringify({
                entity_type,
                complete: false,
                fields,
                note: `Commonly used filters only; OpenAlex accepts more. See ${FILTER_DOCS_URL} for the full list.`
            }, null, 2)
        }]
    };
}
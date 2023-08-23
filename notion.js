// Secrets
require("dotenv").config();

// Notion SDK for JavaScript
const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });

const DATE_PROP_NAME = "Contact Date";
const EMPLOYER_PROP_NAME = "EC - Employer";
const JOB_TITLE_PROP_NAME = "EC - Job Title";
const EMPLOYER_CONTACT = "Employer Contact";

const jobApps = [];

async function queryNotionDatabase() {
  const databaseId = process.env.NOTION_PAGE_ID;
  const query = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: DATE_PROP_NAME,
      date: {
        past_week: {}
      }
    },
    sorts: [
      {
        property: DATE_PROP_NAME,
        direction: "ascending"
      }
    ]
  });

  query.results.forEach((page) => {
    const properties = page.properties;
    const didContactEmployer =
      properties.Activity.select.name === EMPLOYER_CONTACT;

    const jobAppDto = {
      contactDate: properties[DATE_PROP_NAME].date.start,
      isApprovedActivity: false,
      didContactEmployer: didContactEmployer,
      employerName: properties[EMPLOYER_PROP_NAME].title[0].text.content,
      jobTitle: properties[JOB_TITLE_PROP_NAME].rich_text[0].text.content,
      employerContactType: "Application/resume",
      contact: "Website",
      websiteUrl: properties.Website.url
    };

    jobApps.push(jobAppDto);
    console.log(jobApps);
  });
}

async function main() {
  queryNotionDatabase();
}

main();

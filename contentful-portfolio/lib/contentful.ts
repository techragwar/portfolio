import { createClient } from "contentful";

const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

if (!space) {
  throw new Error("Missing CONTENTFUL_SPACE_ID");
}

if (!accessToken) {
  throw new Error("Missing CONTENTFUL_ACCESS_TOKEN");
}

export const contentfulClient = createClient({
  space,
  accessToken,
});
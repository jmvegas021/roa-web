import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";
import { BLOG_SORT_VALUES } from "./constants";

export const blogSearchParsers = {
  sort: parseAsStringLiteral(BLOG_SORT_VALUES).withDefault("new"),
  q: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
};

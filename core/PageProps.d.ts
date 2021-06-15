import type { Query } from "./Query.d.ts";

export interface PageProps {
  location: {
    url: string;
    path: string;
    query: Query;
  };
}

import Query from "./Query.d.ts";

export default interface PageProps {
  location: {
    url: string;
    path: string;
    query: Query;
  };
}

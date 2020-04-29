export default interface PageProps {
  location: {
    url: string;
    path: string;
    query: {
      [key: string]:
        | string
        | number
        | boolean
        | string[]
        | number[]
        | boolean[];
    };
  };
}

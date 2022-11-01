import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params, fetch }) => {
  const data = fetch("/api/");

  return {
    props: {
      data
    }
  }
}
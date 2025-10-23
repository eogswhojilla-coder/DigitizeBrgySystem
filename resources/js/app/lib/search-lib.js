function capitalizeWords(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

const queryParams = new URLSearchParams(window.location.search);
export const search = queryParams.get("search")??'';
export const page = queryParams.get("page")??'';

export function department_slug(params) {
    return window.location.pathname
            .split("/")[3]
            .replace("_", " ");
}


export function ticket_id(params) {
    return window.location.pathname
            .split("/")[4];
}

export function department(params) {
    return queryParams.get("department")??'';
}






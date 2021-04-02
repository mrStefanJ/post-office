interface PostOffice {
  id: string;
  PLZ: number;
  name: string;
}

interface PostOfficeTableColumn {
  id: "id" | "PLZ" | "name";
  label: string;
  formatZipCode?: (value: number) => string;
}

interface CreatePostOfficeRequest {
  PLZ: number;
  name: string;
}

// Type-Only Export (docs: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export)
export type { PostOffice, PostOfficeTableColumn, CreatePostOfficeRequest };

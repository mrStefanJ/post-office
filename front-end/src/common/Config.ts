function isFiniteNumber(value: any): boolean {
  return typeof value === "number" && Number.isFinite(value);
}

function isTruthyString(value: any): boolean {
  return value && typeof value === "string" && value.length > 0;
}

function isObject(data: any): boolean {
  return data && typeof data === "object";
}

function isArray(data: any): boolean {
  return Array.isArray(data) || data instanceof Array;
}

const apiEndpoint: string = "http://localhost:3000";

export { isFiniteNumber, isTruthyString, isObject, isArray, apiEndpoint };

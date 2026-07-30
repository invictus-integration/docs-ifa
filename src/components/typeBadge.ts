import rowStyles from "./resultRow.module.css";

/**
 * Maps a parameter type string (e.g. from a Bicep template or an API
 * definition) to its CSS module class for the pill badge. Shared between
 * ApiPlayground and ParameterTable so the mapping only needs to be
 * maintained in one place.
 */
export function typeBadgeClass(type: string): string {
  switch (type.toLowerCase()) {
    case "string": return rowStyles.typeBadgeString;
    case "int":
    case "integer": return rowStyles.typeBadgeInt;
    case "bool":
    case "boolean": return rowStyles.typeBadgeBool;
    case "object": return rowStyles.typeBadgeObject;
    case "array": return rowStyles.typeBadgeArray;
    case "securestring": return rowStyles.typeBadgeSecureString;
    case "secureobject": return rowStyles.typeBadgeSecureObject;
    default: return rowStyles.typeBadgeDefault;
  }
}

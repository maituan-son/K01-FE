import { useState } from "react";

export type SoftDeleteFilter = "all" | "active" | "deleted";

export function useSoftDeleteFilter(defaultValue: SoftDeleteFilter = "all") {
  const [filter, setFilter] = useState<SoftDeleteFilter>(defaultValue);

  return {
    filter,
    setFilter,
    filterParams:
      filter === "all"
        ? { includeDeleted: true }
        : filter === "active"
        ? { includeDeleted: false }
        : { includeDeleted: true }, // hoặc { onlyDeleted: true } nếu backend hỗ trợ
  };
}
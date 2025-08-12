import { Params } from "@/common/types/api";
import { convertObject } from "@/common/utils/convertParamsToObject";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { useFilter } from "./useFilter";
import { useMemo } from "react";
import { debounce } from "lodash";

export const useTable = <T extends object>() => {
	const { query, resetFilter: reset, updateQueryParams } = useFilter();
	// ACTION FILTER
	const getFilteredValue = (key: string) => {
		return query[key] ? (query[key] as string).split(",") : undefined;
	};

	const resetFilter = () => {
		reset();
	};

	// HANDLE ONCHANGE
	const onChangeSearchInput = useMemo(() => {
		return debounce((text: string, options: { enableOnChangeSearch: boolean }) => {
			if (options.enableOnChangeSearch) {
				updateQueryParams({ ...query, search: text });
			}
		}, 500);
	}, [query]);

	const onSubmitSearch = (text: string) => {
		updateQueryParams({ ...query, search: text });
	};

	const onSelectPaginateChange = (page: number | string, pageSize?: string | number) => {
		updateQueryParams({
			...query,
			page: String(page),
			limit: pageSize ? pageSize.toString() : "10",
		});
	};

	const onFilter = (filter: Record<string, FilterValue | null>, sorter: SorterResult<T> | SorterResult<T>[]) => {
		const filterParams = convertObject(filter);
		console.log(filterParams);
		const sortColumnKey = Array.isArray(sorter) ? sorter[0]?.columnKey : sorter?.columnKey;
		const sortOrder = Array.isArray(sorter) ? sorter[0]?.order : sorter?.order;

		const params: Params = {
			...query,
			...filterParams,
			page: "1",
		};

		if (sortColumnKey && sortOrder) {
			params.sort = sortColumnKey.toString();
			params.order = sortOrder === "ascend" ? "asc" : "desc";
		} else {
			params.sort = undefined;
			params.order = undefined;
		}
		console.log(params);
		updateQueryParams(params);
	};

	const getSorterProps = (
		field: string
	): {
		sorter: true;
		sortOrder?: "ascend" | "descend";
	} => ({
		sorter: true,
		sortOrder:
			query.sort === field ? (query.order ? (query.order === "asc" ? "ascend" : "descend") : undefined) : undefined,
	});
	return {
		query,
		onFilter,
		getSorterProps,
		getFilteredValue,
		resetFilter,
		onSelectPaginateChange,
		onChangeSearchInput,
		onSubmitSearch,
	};
};
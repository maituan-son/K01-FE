import { Params } from "@/common/types/api";
import { setQuery } from "@/common/store/slice/filter.slice";
import { useTypedSelector } from "@/common/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export const useFilter = () => {
	const { query } = useTypedSelector((state) => state.filter);
	const dispatch = useDispatch();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { pathname } = useLocation();

	useEffect(() => {
		const params: Params = {};
		searchParams?.forEach((item, key) => (params[key] = item));
		dispatch(setQuery(params));
	}, []);

	const resetFilter = () => {
		dispatch(setQuery({}));
		navigate(pathname.toString());
	};

	const updateQueryParams = (params: Params) => {
		const newParams = new URLSearchParams(searchParams?.toString());
		console.log(params);
		const checkedParams: Params = {};
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined && value !== null && value !== "") {
				const stringValue = String(value);
				checkedParams[key] = stringValue;
				newParams.set(key, stringValue);
			} else {
				newParams.delete(key);
			}
		}
		dispatch(setQuery(checkedParams));
		navigate(`${pathname}?${newParams.toString()}`);
	};

	return { updateQueryParams, query, resetFilter };
};
import API_CLIENT from "./config";

export const getTestById = async (id) => {
	if (!id) return null;
	try {
		const res = await API_CLIENT.get(`/api/tests/${id}`);
		return res.data?.data || res.data;
	} catch (error) {
		console.error("Error fetching test by id:", error);
		throw error;
	}
};

export const getTestsBySeries = async (testSeriesId, params = {}) => {
	if (!testSeriesId) return { tests: [], pagination: {} };
	try {
		const res = await API_CLIENT.get(`/api/tests/test-series/${testSeriesId}`, {
			params,
		});
		const payload = res.data?.data || res.data || {};
		return {
			tests: payload.tests || [],
			pagination: payload.pagination || {},
		};
	} catch (error) {
		console.error("Error fetching tests by series:", error);
		throw error;
	}
};

export const getTestBySlug = async (slug) => {
	if (!slug) return null;
	try {
		const res = await API_CLIENT.get(`/api/tests/slug/${slug}`);
		return res.data?.data || res.data;
	} catch (error) {
		console.error("Error fetching test by slug:", error);
		throw error;
	}
};

export const getTestQuestions = async (id, params = {}) => {
	if (!id) return { questions: [], pagination: { totalQuestions: 0 } };
	try {
		const res = await API_CLIENT.get(`/api/tests/${id}/questions`, {
			params,
		});
		const data = res.data?.data || res.data;
		return {
			questions: data?.questions || [],
			pagination: data?.pagination || {},
		};
	} catch (error) {
		console.error("Error fetching test questions:", error);
		throw error;
	}
};

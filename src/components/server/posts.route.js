import API_CLIENT from "./config";

const DEFAULT_LIMIT = 9;

const normalizeSubject = (subject) => {
  if (!subject || subject === "all") return undefined;
  return String(subject).toLowerCase();
};

export const fetchPosts = async (params = {}) => {
  const {
    page = 1,
    limit = DEFAULT_LIMIT,
    subject,
    specialization,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const query = {
    page,
    limit,
    sortBy,
    sortOrder,
  };

  const normalizedSubject = normalizeSubject(subject);
  if (normalizedSubject) {
    query.subject = normalizedSubject;
  }
  if (specialization && specialization !== "all") {
    query.specialization = specialization;
  }
  if (search && search.trim()) {
    query.search = search.trim();
  }

  const response = await API_CLIENT.get("/api/posts", { params: query });
  const payload = response.data?.data || response.data;

  return {
    posts: payload?.posts || [],
    pagination: payload?.pagination || {
      currentPage: page,
      totalPages: 1,
      totalPosts: (payload?.posts || []).length,
    },
  };
};

export const fetchPostById = async (id) => {
  if (!id) return null;
  const response = await API_CLIENT.get(`/api/posts/${id}`);
  return response.data?.data || response.data;
};

export const getPostsByEducator = async (educatorId, params = {}) => {
  if (!educatorId) return { posts: [], pagination: { totalPosts: 0 } };
  try {
    const response = await API_CLIENT.get(`/api/posts/educator/${educatorId}`, {
      params,
    });
    const payload = response.data?.data || response.data;
    return {
      posts: payload?.posts || [],
      pagination: payload?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalPosts: (payload?.posts || []).length,
      },
    };
  } catch (error) {
    console.error("Error fetching posts by educator:", error);
    throw error;
  }
};

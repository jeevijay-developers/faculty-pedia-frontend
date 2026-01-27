"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getTestSeriesBySlug,
  getTestSeriesById,
} from "@/components/server/test-series.route";
import {
  getTestById,
  getTestBySlug,
  getTestQuestions,
} from "@/components/server/test.route";
import { submitTestResult } from "@/components/server/test/test.routes";
import API_CLIENT from "@/components/server/config";

const formatTime = (seconds) => {
  const total = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  const hours = Math.floor(total / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((total % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(total % 60)
    .toString()
    .padStart(2, "0");

  // Show hours when at least 1 hour remains; otherwise show minutes:seconds.
  if (total >= 3600) return `${hours}:${minutes}:${secs}`;
  return `${minutes}:${secs}`;
};

const resolveOptions = (source) => {
  if (!source) return [];
  if (Array.isArray(source))
    return source.filter((opt) => opt !== null && opt !== undefined);

  if (typeof source === "string") {
    try {
      const parsed = JSON.parse(source);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && typeof parsed === "object")
        return Object.values(parsed).filter(Boolean);
    } catch (_) {
      const parts = source
        .split(/[|,\n]/)
        .map((p) => p.trim())
        .filter(Boolean);
      if (parts.length) return parts;
    }
  }

  if (typeof source === "object") {
    const objectOptions = (() => {
      const entries = Object.entries(source);
      if (!entries.length) return [];
      // Handle {A:"...", B:"..."} or {A:{text:"..."}}
      const orderedKeys = ["A", "B", "C", "D"];
      const collected = orderedKeys
        .map((k) => source[k])
        .filter((v) => v !== undefined && v !== null)
        .map((v) => (typeof v === "object" && v?.text ? v.text : v));
      if (collected.length) return collected;
      return entries
        .map(([, v]) => (typeof v === "object" && v?.text ? v.text : v))
        .filter(Boolean);
    })();
    return objectOptions;
  }

  return [];
};

const parseCorrectOptions = (raw) => {
  if (raw === undefined || raw === null) return undefined;

  const addValue = (val, into) => {
    if (val === undefined || val === null) return;
    if (typeof val === "number") {
      into.push(String(val));
      return;
    }
    if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed) into.push(trimmed.toUpperCase());
      return;
    }
  };

  // Array of primitives or objects
  if (Array.isArray(raw)) {
    const collected = [];
    raw.forEach((entry) => {
      if (
        entry === undefined ||
        entry === null ||
        (typeof entry === "object" && Object.keys(entry || {}).length === 0)
      )
        return;

      if (typeof entry === "object") {
        const { text, label, option, value, key, idx, index, isCorrect } = entry;
        // If explicit isCorrect flag is false, skip; otherwise include.
        if (isCorrect === false) return;
        addValue(key ?? option ?? text ?? label ?? value, collected);
        if (typeof index === "number" || typeof index === "string")
          addValue(index, collected);
        if (typeof idx === "number" || typeof idx === "string")
          addValue(idx, collected);
        return;
      }

      addValue(entry, collected);
    });

    return collected.length ? collected : undefined;
  }

  // Numeric or string scalar
  if (typeof raw === "number" || typeof raw === "string") {
    const trimmed = String(raw).trim();
    return trimmed ? [trimmed.toUpperCase()] : undefined;
  }

  // Object map like {A:true,B:false,C:true} or {0:true} or {A:"Option text"}
  if (typeof raw === "object") {
    const entries = [];
    Object.entries(raw).forEach(([k, v]) => {
      if (!v) return;
      entries.push(String(k).toUpperCase());
      if (typeof v === "string" || typeof v === "number") {
        const str = String(v).trim();
        if (str) entries.push(str.toUpperCase());
      }
    });
    return entries.length ? entries : undefined;
  }

  return undefined;
};

const normalizeQuestions = (testData) => {
  if (Array.isArray(testData?.questions) && testData.questions.length > 0) {
    return testData.questions.map((q, idx) => {
      const baseOptions = resolveOptions(q.options || q.choices || q.answers);
      const normalizeCorrect = parseCorrectOptions(q.correctOptions ?? q.correctOption);

      return {
        id: q._id || q.id || `q-${idx}`,
        text: q.text || q.title || q.question || `Question ${idx + 1}`,
        type: q.questionType || q.type || "single-select",
        options: baseOptions,
        correctOptions: normalizeCorrect,
        marks:
          typeof q.marks === "number"
            ? { positive: q.marks, negative: q.negativeMarks || 0 }
            : q.marks || { positive: 1, negative: 0 },
      };
    });
  }

  if (Array.isArray(testData?.tests) && testData.tests.length > 0) {
    return testData.tests.map((t, idx) => ({
      id: t._id || t.id || `t-${idx}`,
      text: t.title || t.question || `Question ${idx + 1}`,
      type: t.questionType || t.type || "single-select",
      options: resolveOptions(t.options || t.answers),
      correctOptions: parseCorrectOptions(t.correctOptions ?? t.correctOption),
      marks: t.marks || { positive: 1, negative: 0 },
    }));
  }

  return [];
};

const hydrateMissingOptions = async (questions = []) => {
  const hydrated = await Promise.all(
    questions.map(async (q) => {
      const hasOptions = Array.isArray(q.options) && q.options.length > 0;
      const hasCorrect = q.correctOptions && q.correctOptions.length > 0;
      if (hasOptions && hasCorrect) return q;
      // If options exist but correctOptions are missing, or vice versa, fetch full question details
      const questionId = q.id;
      if (!questionId)
        return { ...q, options: [], correctOptions: q.correctOptions };
      try {
        const res = await API_CLIENT.get(`/api/questions/${questionId}`);
        const detail = res.data?.data || res.data;
        const [normalized] = normalizeQuestions({ questions: [detail] });
        if (normalized?.options?.length) {
          return {
            ...q,
            options: normalized.options,
            correctOptions: normalized.correctOptions || q.correctOptions,
            type: normalized.type || q.type || "single-select",
            marks: normalized.marks || q.marks,
          };
        }
      } catch (err) {
        console.error("Failed to hydrate options", questionId, err);
      }
      return {
        ...q,
        options: q.options || [],
        correctOptions: q.correctOptions,
        type: q.type || "single-select",
      };
    })
  );

  return hydrated.map((q) => ({
    ...q,
    options:
      q.options && q.options.length > 0
        ? q.options
        : ["Option A", "Option B", "Option C", "Option D"],
  }));
};

const getDurationSeconds = (testData) => {
  if (!testData) return 0;
  if (typeof testData.durationSeconds === "number")
    return testData.durationSeconds;
  if (typeof testData.duration === "number") return testData.duration * 60;
  if (typeof testData.durationMinutes === "number")
    return testData.durationMinutes * 60;
  if (typeof testData.totalDuration === "number")
    return testData.totalDuration * 60;
  return 0;
};

const TestPanelPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [resultsPath, setResultsPath] = useState("/profile?tab=results");
  const [studentId, setStudentId] = useState(null);
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [submitSummary, setSubmitSummary] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem("faculty-pedia-student-data")
          : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        const parsedStudentId = parsed?._id || parsed?.id;
        if (parsedStudentId) {
          setStudentId(parsedStudentId);
          setResultsPath(`/profile/student/${parsedStudentId}?tab=results`);
          return;
        }
      }
    } catch (err) {
      console.warn("Unable to derive profile results path", err);
    }
    setStudentId(null);
    setResultsPath("/profile?tab=results");
  }, []);

  const loadQuestions = useCallback(async (testId) => {
    setQuestionLoading(true);
    try {
      const res = await getTestQuestions(testId, { limit: 200 });
      const normalized = normalizeQuestions({ questions: res.questions });
      const hydrated = await hydrateMissingOptions(normalized);
      setQuestions(hydrated);
      if (hydrated.length > 0) setCurrentIndex(0);
    } catch (err) {
      console.error("Failed to load questions", err);
      setQuestions([]);
    } finally {
      setQuestionLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        if (slug) {
          // 1) Try loading as a direct test (slug or ObjectId)
          const looksLikeId = /^[a-fA-F0-9]{24}$/.test(slug);
          let directTest = null;
          try {
            directTest = await getTestBySlug(slug);
          } catch (err) {
            // ignore and fallback to id/series resolution
          }

          if (!directTest && looksLikeId) {
            try {
              directTest = await getTestById(slug);
            } catch (err) {
              // ignore and proceed to series lookup
            }
          }

          if (!cancelled && directTest) {
            const resolvedTest = directTest?.data || directTest; // handle {data: test}
            setTestData(resolvedTest);
            setSecondsLeft(getDurationSeconds(resolvedTest));

            const embeddedList = normalizeQuestions({
              questions: resolvedTest?.questions,
            });
            if (embeddedList.length > 0) {
              const hydrated = await hydrateMissingOptions(embeddedList);
              setQuestions(hydrated);
              setCurrentIndex(0);
            } else {
              const directTestId = resolvedTest?._id || resolvedTest?.id;
              if (directTestId) await loadQuestions(directTestId);
              else setQuestions([]);
            }
            return; // already resolved as a direct test
          }

          // 2) Otherwise, resolve as a test series (slug first, then ObjectId)
          let data = null;
          try {
            data = await getTestSeriesBySlug(slug);
          } catch (err) {
            if (looksLikeId) {
              try {
                data = await getTestSeriesById(slug);
              } catch (innerErr) {
                if (!cancelled)
                  setError(
                    innerErr?.message || "Failed to load test series by id"
                  );
              }
            } else if (!cancelled) {
              setError(
                err?.response?.data?.message ||
                  err?.message ||
                  "Failed to load test series"
              );
            }
          }

          if (!cancelled && data) {
            const testSeries = data?.testSeries || data;
            const firstTest =
              Array.isArray(testSeries?.tests) && testSeries.tests.length > 0
                ? testSeries.tests[0]
                : null;

            if (!firstTest) {
              setError("No tests found for this test series.");
              setQuestions([]);
              return;
            }

            const firstTestId = firstTest?._id || firstTest?.id || firstTest;
            const testDetail = await getTestById(firstTestId);
            setTestData(testDetail);
            setSecondsLeft(getDurationSeconds(testDetail || testSeries));
            // Use embedded questions if provided on the test payload before fetching separately
            const embeddedList = normalizeQuestions({
              questions: testDetail?.questions,
            });
            if (embeddedList.length > 0) {
              const hydrated = await hydrateMissingOptions(embeddedList);
              setQuestions(hydrated);
              setCurrentIndex(0);
            } else {
              await loadQuestions(firstTestId);
            }
          } else if (!cancelled && !data) {
            setError("Test not found");
            setQuestions([]);
          }
        } else if (!cancelled) {
          setError("Missing test identifier");
        }
      } catch (err) {
        console.error("Failed to load test series", err);
        if (!cancelled) setError(err?.message || "Failed to load test");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!secondsLeft || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const selectAnswer = useCallback((questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const isAnswered = (qId) => {
    const val = answers[qId];
    return val !== undefined && val !== "" && val !== null;
  };

  const filteredQuestions = useMemo(() => {
    if (filter === "answered") {
      return questions.filter((q) => isAnswered(q.id));
    }
    if (filter === "unanswered") {
      return questions.filter((q) => !isAnswered(q.id));
    }
    return questions;
  }, [filter, questions, answers]);

  const effectiveIndex = useMemo(() => {
    if (filteredQuestions.length === 0) return 0;
    const currentId = questions[currentIndex]?.id;
    const idx = filteredQuestions.findIndex((q) => q.id === currentId);
    return idx === -1 ? 0 : idx;
  }, [filteredQuestions, questions, currentIndex]);

  const currentQuestion = filteredQuestions[effectiveIndex] || null;

  const isLastQuestion = useMemo(() => {
    if (!currentQuestion) return false;
    const fullIdx = questions.findIndex((q) => q.id === currentQuestion.id);
    return fullIdx === questions.length - 1;
  }, [currentQuestion, questions]);

  const handleNext = () => {
    if (effectiveIndex < filteredQuestions.length - 1) {
      const nextId = filteredQuestions[effectiveIndex + 1]?.id;
      const fullIdx = questions.findIndex((q) => q.id === nextId);
      if (fullIdx >= 0) setCurrentIndex(fullIdx);
    }
  };

  const handlePrev = () => {
    if (effectiveIndex > 0) {
      const prevId = filteredQuestions[effectiveIndex - 1]?.id;
      const fullIdx = questions.findIndex((q) => q.id === prevId);
      if (fullIdx >= 0) setCurrentIndex(fullIdx);
    }
  };

  const answeredCount = useMemo(
    () => questions.filter((q) => isAnswered(q.id)).length,
    [questions, answers]
  );
  const completion = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  const submitTest = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const computeSummary = () => {
        let correct = 0;
        let incorrect = 0;
        let unattempted = 0;

        const questionBreakdown = questions.map((q) => {
          const answer = answers[q.id];

          const normalizeVal = (val) => {
            if (val === undefined || val === null) return null;
            if (typeof val === "number" && Number.isFinite(val))
              return String(val).trim();
            return String(val).trim();
          };

          if (q.type === "integer") {
            const studentVal =
              answer === undefined || answer === null || answer === ""
                ? null
                : Number(answer);
            const correctValRaw = q.correctOptions?.[0];
            const correctVal =
              correctValRaw === undefined || correctValRaw === null
                ? null
                : Number(correctValRaw);
            const isCorrect =
              studentVal !== null &&
              !Number.isNaN(studentVal) &&
              correctVal !== null &&
              !Number.isNaN(correctVal) &&
              Number(studentVal) === Number(correctVal);

            if (studentVal === null || Number.isNaN(studentVal)) {
              unattempted += 1;
            } else if (isCorrect) {
              correct += 1;
            } else {
              incorrect += 1;
            }

            return {
              questionId: q.id,
              type: q.type,
              selected: studentVal,
              correct: correctVal,
              isCorrect,
            };
          }

          const selectedIndex = answer;
          if (
            selectedIndex === undefined ||
            selectedIndex === null ||
            selectedIndex === ""
          ) {
            unattempted += 1;
            return {
              questionId: q.id,
              type: q.type,
              selected: null,
              correct: q.correctOptions || [],
              isCorrect: false,
            };
          }

          const selectedIdxNum = Number(selectedIndex);
          const letterZeroBased = String.fromCharCode(65 + selectedIdxNum);
          const letterOneBased = String.fromCharCode(64 + selectedIdxNum); // supports 1-based keys
          const optionText = Array.isArray(q.options)
            ? q.options[selectedIdxNum]
            : undefined;

          const correctSet = new Set();
          const addOptionTextByIndex = (idx) => {
            if (!Array.isArray(q.options)) return;
            if (!Number.isFinite(idx)) return;
            if (idx < 0 || idx >= q.options.length) return;
            const text = q.options[idx];
            const normalized = normalizeVal(text);
            if (normalized) correctSet.add(normalized.toUpperCase());
          };

          const addIndexLetters = (idx) => {
            if (!Number.isFinite(idx)) return;
            // zero-based letter (0 -> A)
            correctSet.add(String.fromCharCode(65 + idx).toUpperCase());
            addOptionTextByIndex(idx);
            // also treat 1-based to tolerate authoring styles (1 -> A)
            const oneBasedIdx = idx - 1;
            if (oneBasedIdx >= 0) {
              correctSet.add(String.fromCharCode(65 + oneBasedIdx).toUpperCase());
              addOptionTextByIndex(oneBasedIdx);
            }
          };

          const addFromValue = (val) => {
            const normalizedRaw = normalizeVal(val);
            if (normalizedRaw) correctSet.add(normalizedRaw.toUpperCase());

            const num = Number(val);
            if (!Number.isNaN(num) && Number.isFinite(num)) {
              addIndexLetters(num);
            } else if (typeof normalizedRaw === "string" && normalizedRaw.length === 1) {
              const idxFromLetter = normalizedRaw.toUpperCase().charCodeAt(0) - 65;
              if (idxFromLetter >= 0 && idxFromLetter < 26) {
                addIndexLetters(idxFromLetter);
              }
            }
          };

          if (Array.isArray(q.correctOptions)) {
            q.correctOptions.forEach(addFromValue);
          } else if (
            q.correctOptions !== undefined &&
            q.correctOptions !== null
          ) {
            addFromValue(q.correctOptions);
          }

          const normalizedSelectedOptionText = normalizeVal(optionText)?.toUpperCase();
          const isCorrectByLetter =
            correctSet.has(letterZeroBased.toUpperCase()) ||
            correctSet.has(letterOneBased.toUpperCase());
          const isCorrectByText =
            normalizedSelectedOptionText && correctSet.has(normalizedSelectedOptionText);

          const isCorrect = Boolean(isCorrectByLetter || isCorrectByText);

          if (isCorrect) correct += 1;
          else incorrect += 1;

          return {
            questionId: q.id,
            type: q.type,
            selected: letterZeroBased,
            correct: q.correctOptions || [],
            isCorrect,
          };
        });

        const total = questions.length || 0;
        const totalMarks = questions.reduce(
          (sum, q) => sum + Number(
            typeof q?.marks === "number"
              ? q.marks
              : q?.marks?.positive || 1
          ),
          0
        );
        const obtained = questions.reduce((sum, q, idx) => {
          const breakdown = questionBreakdown[idx];
          if (!breakdown) return sum;
          const posMarks = Number(
            typeof q?.marks === "number"
              ? q.marks
              : q?.marks?.positive || 1
          );
          const negMarks = Number(
            typeof q?.marks === "number"
              ? q.negativeMarks || 0
              : q?.marks?.negative || 0
          );
          if (breakdown.isCorrect) return sum + posMarks;
          if (breakdown.selected === null || breakdown.selected === undefined)
            return sum;
          return sum - negMarks;
        }, 0);
        const percentage = totalMarks
          ? Math.max(0, Math.round((obtained / totalMarks) * 100))
          : 0;

        return {
          correct,
          incorrect,
          unattempted,
          total,
          totalMarks,
          obtained,
          percentage,
          questionBreakdown,
        };
      };

      const summary = computeSummary();

      const durationSeconds = getDurationSeconds(testData);
      const timeTakenSeconds =
        typeof durationSeconds === "number" && durationSeconds > 0
          ? Math.max(0, durationSeconds - secondsLeft)
          : null;
      const timeTakenMinutes =
        timeTakenSeconds !== null
          ? Math.round(timeTakenSeconds / 60)
          : undefined;

      const resultPayload = {
        studentId: studentId || undefined,
        testId: testData?._id || testData?.id || slug,
        testSeriesId: testData?.testSeriesID || testData?.testSeriesId,
        testTitle: headerTitle,
        testSlug: testData?.slug || slug,
        submittedAt: new Date().toISOString(),
        timeTaken: timeTakenMinutes,
        ...summary,
      };

      let serverSaved = false;
      try {
        await submitTestResult(resultPayload);
        serverSaved = true;
      } catch (err) {
        console.warn("Submit test result fallback to local storage", err);
        setSubmitError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to sync with server right now. Saved locally — you can view it in Test Results."
        );
      }

      try {
        const storageKey = studentId
          ? `faculty-pedia-offline-results-${studentId}`
          : "faculty-pedia-offline-results";
        const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
        const filtered = Array.isArray(existing)
          ? existing.filter((item) => item?.testId !== resultPayload.testId)
          : [];
        localStorage.setItem(
          storageKey,
          JSON.stringify(
            [{ ...resultPayload, serverSaved }, ...filtered].slice(0, 50)
          )
        );
      } catch (err) {
        console.warn("Failed to store offline result", err);
      }

      setSubmitSummary({ ...resultPayload, serverSaved });
      setShowSummaryModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  const headerTitle = testData?.title || "Test Panel";
  const headerSubtitle =
    testData?.subtitle || testData?.description || "Timed assessment";

  return (
    <>
      <div className="min-h-screen h-screen w-full flex flex-col bg-linear-to-b from-slate-100 via-white to-slate-100 py-8 px-4 sm:px-6 lg:px-10">
        <div className="w-full flex-1 flex flex-col space-y-6">
          <div className="flex items-center justify-between gap-4 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                A+
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                  Academic Test
                </p>
                <h1 className="text-lg font-semibold text-slate-900">
                  {headerTitle}
                </h1>
                <p className="text-xs text-slate-600">{headerSubtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <span className="inline-flex h-9 items-center rounded-full bg-indigo-50 px-3 text-indigo-700 border border-indigo-100">
                  {formatTime(secondsLeft)}
                </span>
                <div className="w-28 h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all"
                    style={{ width: `${Math.min(completion, 100)}%` }}
                  />
                </div>
              </div>
              {isLastQuestion && (
                <button
                  onClick={submitTest}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Submitting..." : "Submit Test"}
                </button>
              )}
            </div>
          </div>

          {submitError && (
            <div className="p-3 rounded-md border border-amber-200 bg-amber-50 text-amber-800 text-sm">
              {submitError}
            </div>
          )}

          {error && (
            <div className="p-3 rounded-md border border-rose-200 bg-rose-50 text-rose-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
            <aside className="lg:col-span-4 xl:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-sm p-4 space-y-4 h-full">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">
                  Question Panel
                </p>
                <p className="text-xs text-slate-500">
                  {answeredCount}/{questions.length} answered
                </p>
              </div>
              <div className="flex gap-2 text-xs font-semibold">
                {[
                  { key: "all", label: "All" },
                  { key: "answered", label: "Answered" },
                  { key: "unanswered", label: "Unanswered" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setFilter(item.key)}
                    className={`px-3 py-1 rounded-full border text-xs transition-colors ${
                      filter === item.key
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 text-slate-600 hover:border-indigo-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-4 xl:grid-cols-5 gap-2 max-h-85 overflow-y-auto pr-1">
                {filteredQuestions.map((q, idx) => {
                  const isCurrent = q.id === currentQuestion?.id;
                  const answered = isAnswered(q.id);
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        const fullIdx = questions.findIndex(
                          (qq) => qq.id === q.id
                        );
                        if (fullIdx >= 0) setCurrentIndex(fullIdx);
                      }}
                      className={`h-10 rounded-md text-sm font-semibold border transition-colors ${
                        isCurrent
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : answered
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
                {filteredQuestions.length === 0 && (
                  <div className="col-span-full text-xs text-slate-500">
                    No questions for this filter.
                  </div>
                )}
              </div>
            </aside>

            <section className="lg:col-span-8 xl:col-span-9 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5 h-full">
              {loading || questionLoading ? (
                <div className="text-center text-slate-500">
                  Loading test...
                </div>
              ) : currentQuestion ? (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-indigo-600 font-semibold">
                        Question{" "}
                        {questions.findIndex(
                          (q) => q.id === currentQuestion.id
                        ) + 1}{" "}
                        of {questions.length}
                      </p>
                      <h2 className="text-xl font-semibold text-slate-900 leading-snug">
                        {currentQuestion.text}
                      </h2>
                    </div>
                    <div className="text-sm text-slate-500">
                      {isAnswered(currentQuestion.id)
                        ? "Answered"
                        : "Unanswered"}
                    </div>
                  </div>

                  {currentQuestion.type === "integer" ? (
                    <div className="space-y-2">
                      <label
                        className="text-sm text-slate-600 font-medium"
                        htmlFor={`ans-${currentQuestion.id}`}
                      >
                        Enter your answer (integer)
                      </label>
                      <input
                        id={`ans-${currentQuestion.id}`}
                        type="number"
                        inputMode="numeric"
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white"
                        value={answers[currentQuestion.id] ?? ""}
                        onChange={(e) =>
                          selectAnswer(currentQuestion.id, e.target.value)
                        }
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentQuestion.options.map((opt, idx) => {
                        const selected = answers[currentQuestion.id] === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() =>
                              selectAnswer(currentQuestion.id, idx)
                            }
                            className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                              selected
                                ? "border-indigo-600 bg-indigo-50 text-indigo-800 shadow-sm"
                                : "border-slate-200 hover:border-indigo-200 bg-white text-slate-800"
                            }`}
                          >
                            <span className="font-semibold mr-2">
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handlePrev}
                      disabled={
                        effectiveIndex === 0 || filteredQuestions.length === 0
                      }
                      className="px-4 py-2 rounded-md text-sm font-semibold border border-slate-200 text-slate-700 disabled:opacity-50 hover:border-indigo-200"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-3">
                      {!isLastQuestion && (
                        <button
                          onClick={handleNext}
                          disabled={
                            effectiveIndex >= filteredQuestions.length - 1
                          }
                          className="px-4 py-2 rounded-md text-sm font-semibold border border-slate-200 text-slate-700 disabled:opacity-50 hover:border-indigo-200"
                        >
                          Next
                        </button>
                      )}
                      {isLastQuestion && (
                        <button
                          onClick={submitTest}
                          disabled={submitting}
                          className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {submitting ? "Submitting..." : "Submit Test"}
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-slate-500">
                  No questions available.
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {showSummaryModal && submitSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowSummaryModal(false)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-emerald-600 font-semibold">
                  Test submitted
                </p>
                <h3 className="text-xl font-semibold text-slate-900">
                  {submitSummary.testTitle || "Test"}
                </h3>
                <p className="text-sm text-slate-600">
                  Submission saved{" "}
                  {submitSummary.serverSaved ? "and synced" : "offline"}. Check
                  Test Results for full details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                className="text-slate-500 hover:text-slate-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-800">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Score
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {submitSummary.obtained} / {submitSummary.totalMarks}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Accuracy
                </p>
                <p className="text-lg font-semibold text-emerald-700">
                  {submitSummary.percentage}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Correct
                </p>
                <p className="text-lg font-semibold text-emerald-700">
                  {submitSummary.correct}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Incorrect
                </p>
                <p className="text-lg font-semibold text-rose-600">
                  {submitSummary.incorrect}
                </p>
              </div>
            </div>

            {!submitSummary.serverSaved && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-xs px-3 py-2">
                Saved locally. Keep the app online to sync this result to your
                account automatically.
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                className="px-4 py-2 rounded-md text-sm font-semibold border border-slate-200 text-slate-700 hover:border-indigo-200"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSummaryModal(false);
                  router.push(resultsPath);
                }}
                className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
              >
                View Test Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TestPanelPage;

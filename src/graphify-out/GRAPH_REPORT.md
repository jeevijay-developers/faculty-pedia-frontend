# Graph Report - faculty-pedia-frontend\src  (2026-05-28)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 683 nodes · 1127 edges · 73 communities (59 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]

## God Nodes (most connected - your core abstractions)
1. `WebinarDetailsPage()` - 15 edges
2. `CourseDetails()` - 15 edges
3. `ViewProfile()` - 14 edges
4. `EnrollButton()` - 12 edges
5. `getTestSeriesById()` - 12 edges
6. `CoursePanelPage()` - 11 edges
7. `LiveClasses()` - 11 edges
8. `TestSeriesCarousel()` - 11 edges
9. `CourseCard()` - 10 edges
10. `CoursesTab()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `OneToOneLiveCoursesPage()` --calls--> `getAllCourses()`  [EXTRACTED]
  app/1-1-live-class/page.jsx → components/server/course.routes.js
- `OneToAllLiveCoursesPage()` --calls--> `getAllCourses()`  [EXTRACTED]
  app/1-all-live-Courses/page.jsx → components/server/course.routes.js
- `CoursePanelPage()` --calls--> `getCourseById()`  [EXTRACTED]
  app/course-panel/page.jsx → components/server/course.routes.js
- `CoursePanelPage()` --calls--> `getTestSeriesByCourse()`  [EXTRACTED]
  app/course-panel/page.jsx → components/server/test-series.route.js
- `Page()` --calls--> `getTestSeriesById()`  [EXTRACTED]
  app/details/test-series/[id]/page.jsx → components/server/test-series.route.js

## Communities (73 total, 14 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (22): CBSEPageContent, CourseCarousel(), EducatorCard(), EducatorsPage(), PostDetailsPage(), TestSeriesDetailPage(), fetchIITJEEBlogs(), fetchLiveClassesBySpecialization() (+14 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (29): OneToOneLiveCoursesPage(), OneToAllLiveCoursesPage(), Page(), CourseCard(), sanitizeImageUrl(), CoursesPage(), extractVimeoId(), safeNumber() (+21 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (24): AnswerOptions(), [answers, setAnswers], calculateResults(), [currentQuestionIndex, setCurrentQuestionIndex], [enlargedImage, setEnlargedImage], [error, setError], fetchTestData(), [isSubmitting, setIsSubmitting] (+16 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (26): Page(), CoursePanelPage(), getEmbedUrl(), TestSeriesTab(), API_CLIENT, getBaseURL(), normalizeUrl(), TOKEN (+18 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (28): extractToken(), extractUserData(), formatAuthResponse(), loginUser(), requestEmailVerification(), requestPreSignupVerification(), resendEmailVerification(), signupAsEducator() (+20 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (15): FALLBACK_BASE_URL, SIZE_CLASSNAMES, VARIANT_CLASSNAMES, testSeriesDetails, CourseDetails(), deriveEducatorImage(), getIntroEmbedUrl(), getVimeoEmbedUrl() (+7 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (10): ExamDetails(), TestAccordion(), CourseCard(), AllTestSeries(), AllTestSeries(), calculateValidity(), formatCurrency(), formatDate() (+2 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (16): clampPercent(), CourseCard(), formatDate(), getEducatorName(), getHeroImage(), getStartDate(), getTestsCount(), getTestsFromSeries() (+8 more)

### Community 8 - "Community 8"
Cohesion: 0.15
Nodes (9): StudentTestSeriesDetail(), StudentWebinarDetailPage(), WebinarsTab(), extractWebinarPayload(), getTestSeriesForStudent(), getUpcomingTestSeries(), getUpcomingWebinars(), getWebinarById() (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.17
Nodes (5): CourseCard(), formatDate(), liveWebinarData, upcomingWebinarData, upcomingWebinarSpecializedData

### Community 10 - "Community 10"
Cohesion: 0.29
Nodes (10): Page(), GenericLoginPage(), updateEducatorProfile(), getDashboardUrl(), getProfileUrl(), getUserData(), getUserRole(), isEducator() (+2 more)

### Community 11 - "Community 11"
Cohesion: 0.19
Nodes (7): createPaymentOrder(), getEducatorPayments(), getStudentPayments(), initiatePayment(), paymentService, settlePayment(), verifyPayment()

### Community 12 - "Community 12"
Cohesion: 0.27
Nodes (13): DebugInfo(), WebinarCard(), getApiUrl(), getDebugInfo(), getDeploymentPlatform(), getEnvironment(), isClient(), isDevelopment() (+5 more)

### Community 13 - "Community 13"
Cohesion: 0.16
Nodes (6): LiveClasses(), capitalize(), formatList(), getMeetingLink(), OverviewTab(), getEnrolledLiveClasses()

### Community 14 - "Community 14"
Cohesion: 0.21
Nodes (9): confirmAlert(), showAlert(), showError(), showInfo(), showSuccess(), showWarning(), handleSubmitTest(), EducatorsTab() (+1 more)

### Community 15 - "Community 15"
Cohesion: 0.17
Nodes (7): demoStudentData, ResultsTab(), CLASS_LABELS, INITIAL_NOTIFICATION_STATE, StudentDashboard(), TAB_IDS, updateStudentProfile()

### Community 16 - "Community 16"
Cohesion: 0.23
Nodes (7): defaultCourses, getCoursesBySpecialization(), getCoursesBySubject(), getCourseWithEducator(), getEducatorById(), educatorsData, getEducatorsBySubject()

### Community 17 - "Community 17"
Cohesion: 0.18
Nodes (5): geistMono, geistSans, metadata, HIDE_PREFIXES, AlertContainer()

### Community 18 - "Community 18"
Cohesion: 0.24
Nodes (6): INITIAL_NOTIFICATION_STATE, Navbar(), MessagesTab(), createHttpError(), getStudentNotifications(), markNotificationAsRead()

### Community 19 - "Community 19"
Cohesion: 0.27
Nodes (4): AllPostsSection(), fetchPosts(), getPostsByEducator(), normalizeSubject()

### Community 20 - "Community 20"
Cohesion: 0.24
Nodes (8): StudentCourseDetail(), StudentDashboardPage(), extractPayload(), getCourseForStudent(), getStudentById(), getStudentStatistics(), isLikelyObjectId(), isStudentEnrolledInCourse()

### Community 23 - "Community 23"
Cohesion: 0.33
Nodes (4): commitments, contactMethods, educatorServices, socialLinks

### Community 27 - "Community 27"
Cohesion: 0.40
Nodes (3): beliefs, limitations, services

### Community 32 - "Community 32"
Cohesion: 0.50
Nodes (3): examData, neetExamData, offlineExamData

## Knowledge Gaps
- **58 isolated node(s):** `geistSans`, `geistMono`, `metadata`, `StyledWrapper`, `services` (+53 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `WebinarCard()` connect `Community 12` to `Community 1`, `Community 9`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Why does `EnrollButton()` connect `Community 4` to `Community 8`, `Community 5`, `Community 13`, `Community 6`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `CourseDetails()` connect `Community 5` to `Community 0`, `Community 1`, `Community 3`, `Community 4`, `Community 7`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `CourseDetails()` (e.g. with `getIntroEmbedUrl()` and `getYouTubeEmbedUrl()`) actually correct?**
  _`CourseDetails()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `geistSans`, `geistMono`, `metadata` to the rest of the system?**
  _58 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05271629778672032 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05357142857142857 - nodes in this community are weakly interconnected._
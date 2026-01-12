# DefaultApi

All URIs are relative to *http://localhost:3001*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiAttemptsPost**](DefaultApi.md#apiattemptspost) | **POST** /api/attempts | Submit my attempt for a lesson |
| [**apiAuthGooglePost**](DefaultApi.md#apiauthgooglepost) | **POST** /api/auth/google | Login with Google (exchange idToken for accessToken) |
| [**apiCoursesCourseIdGet**](DefaultApi.md#apicoursescourseidget) | **GET** /api/courses/{courseId} | Get course by ID |
| [**apiCoursesGet**](DefaultApi.md#apicoursesget) | **GET** /api/courses | Get all courses |
| [**apiDictionaryGet**](DefaultApi.md#apidictionaryget) | **GET** /api/dictionary | Get dictionary entries |
| [**apiLessonsLessonIdGet**](DefaultApi.md#apilessonslessonidget) | **GET** /api/lessons/{lessonId} | Get lesson by ID |
| [**apiProgressMeGet**](DefaultApi.md#apiprogressmeget) | **GET** /api/progress/me | Get my progress (authenticated) |
| [**apiProgressMeLessonLessonIdAttemptGet**](DefaultApi.md#apiprogressmelessonlessonidattemptget) | **GET** /api/progress/me/lesson/{lessonId}/attempt | Get my attempt for a lesson |
| [**apiProgressUserIdGet**](DefaultApi.md#apiprogressuseridget) | **GET** /api/progress/{userId} | Get user progress (legacy - prefer /api/progress/me) |
| [**healthGet**](DefaultApi.md#healthget) | **GET** /health | Health check |



## apiAttemptsPost

> AttemptCreateResponse apiAttemptsPost(attemptCreateRequest)

Submit my attempt for a lesson

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiAttemptsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // AttemptCreateRequest
    attemptCreateRequest: ...,
  } satisfies ApiAttemptsPostRequest;

  try {
    const data = await api.apiAttemptsPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **attemptCreateRequest** | [AttemptCreateRequest](AttemptCreateRequest.md) |  | |

### Return type

[**AttemptCreateResponse**](AttemptCreateResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Attempt saved + progress updated |  -  |
| **400** | Invalid payload |  -  |
| **401** | Unauthorized |  -  |
| **409** | Already attempted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiAuthGooglePost

> AuthGoogleResponse apiAuthGooglePost(authGoogleRequest)

Login with Google (exchange idToken for accessToken)

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiAuthGooglePostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // AuthGoogleRequest
    authGoogleRequest: ...,
  } satisfies ApiAuthGooglePostRequest;

  try {
    const data = await api.apiAuthGooglePost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **authGoogleRequest** | [AuthGoogleRequest](AuthGoogleRequest.md) |  | |

### Return type

[**AuthGoogleResponse**](AuthGoogleResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Auth success |  -  |
| **400** | idToken missing / bad request |  -  |
| **401** | Invalid token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiCoursesCourseIdGet

> Course apiCoursesCourseIdGet(courseId)

Get course by ID

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiCoursesCourseIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    courseId: courseId_example,
  } satisfies ApiCoursesCourseIdGetRequest;

  try {
    const data = await api.apiCoursesCourseIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **courseId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Course**](Course.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Course details |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiCoursesGet

> Array&lt;Course&gt; apiCoursesGet()

Get all courses

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiCoursesGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.apiCoursesGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;Course&gt;**](Course.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of courses |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiDictionaryGet

> Array&lt;DictionaryEntry&gt; apiDictionaryGet()

Get dictionary entries

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiDictionaryGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.apiDictionaryGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;DictionaryEntry&gt;**](DictionaryEntry.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Dictionary |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiLessonsLessonIdGet

> Lesson apiLessonsLessonIdGet(lessonId)

Get lesson by ID

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiLessonsLessonIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    lessonId: lessonId_example,
  } satisfies ApiLessonsLessonIdGetRequest;

  try {
    const data = await api.apiLessonsLessonIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **lessonId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Lesson**](Lesson.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Lesson |  -  |
| **404** | Lesson not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiProgressMeGet

> Progress apiProgressMeGet()

Get my progress (authenticated)

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiProgressMeGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  try {
    const data = await api.apiProgressMeGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Progress**](Progress.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Progress |  -  |
| **401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiProgressMeLessonLessonIdAttemptGet

> LessonAttempt apiProgressMeLessonLessonIdAttemptGet(lessonId)

Get my attempt for a lesson

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiProgressMeLessonLessonIdAttemptGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DefaultApi(config);

  const body = {
    // string
    lessonId: lessonId_example,
  } satisfies ApiProgressMeLessonLessonIdAttemptGetRequest;

  try {
    const data = await api.apiProgressMeLessonLessonIdAttemptGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **lessonId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**LessonAttempt**](LessonAttempt.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Attempt |  -  |
| **401** | Unauthorized |  -  |
| **404** | No attempt |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiProgressUserIdGet

> Progress apiProgressUserIdGet(userId)

Get user progress (legacy - prefer /api/progress/me)

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ApiProgressUserIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    userId: userId_example,
  } satisfies ApiProgressUserIdGetRequest;

  try {
    const data = await api.apiProgressUserIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Progress**](Progress.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Progress |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## healthGet

> healthGet()

Health check

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { HealthGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.healthGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


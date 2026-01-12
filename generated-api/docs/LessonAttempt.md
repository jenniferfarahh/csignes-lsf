
# LessonAttempt


## Properties

Name | Type
------------ | -------------
`userId` | string
`lessonId` | string
`selectedIndex` | number
`isCorrect` | boolean
`xpAwarded` | number

## Example

```typescript
import type { LessonAttempt } from ''

// TODO: Update the object below with actual values
const example = {
  "userId": null,
  "lessonId": null,
  "selectedIndex": null,
  "isCorrect": null,
  "xpAwarded": null,
} satisfies LessonAttempt

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as LessonAttempt
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



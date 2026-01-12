
# Progress


## Properties

Name | Type
------------ | -------------
`userId` | string
`xp` | number
`completedLessons` | Array&lt;string&gt;
`lastLessonId` | string
`lastUserAnswer` | number
`lastWasCorrect` | boolean
`lastXpEarned` | number
`updatedAt` | Date

## Example

```typescript
import type { Progress } from ''

// TODO: Update the object below with actual values
const example = {
  "userId": null,
  "xp": null,
  "completedLessons": null,
  "lastLessonId": null,
  "lastUserAnswer": null,
  "lastWasCorrect": null,
  "lastXpEarned": null,
  "updatedAt": null,
} satisfies Progress

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Progress
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)




# Lesson


## Properties

Name | Type
------------ | -------------
`id` | string
`title` | string
`steps` | [Array&lt;LessonStepsInner&gt;](LessonStepsInner.md)

## Example

```typescript
import type { Lesson } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "title": null,
  "steps": null,
} satisfies Lesson

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Lesson
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



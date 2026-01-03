# TODO / Future Improvements

## AI Safety - Age-Appropriate Responses

**Priority: High**

Modify all AI prompts to ensure content is age-appropriate by adding a safety tag based on the child's year level:

| Year Level | Age | Prompt Addition |
|------------|-----|-----------------|
| Prep | 5-6 | `Safe for 5yo.` |
| Year 1 | 6-7 | `Safe for 6yo.` |
| Year 2 | 7-8 | `Safe for 7yo.` |
| Year 3 | 8-9 | `Safe for 8yo.` |
| Year 4 | 9-10 | `Safe for 9yo.` |
| Year 5 | 10-11 | `Safe for 10yo.` |
| Year 6 | 11-12 | `Safe for 11yo.` |

**Implementation notes:**
- Keep token count minimal (use shortest effective phrasing)
- Add to system prompt or as prefix to all AI tutor calls
- Affects: `ai.ts` handler (explanations, hints, tutor chat)

---

## Weekly Email Reports

Implement actual weekly email delivery for paid tier users (currently just UI/marketing copy on pricing page).

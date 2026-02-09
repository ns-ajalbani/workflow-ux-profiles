# Test Coverage - Quick Reference Guide

## Current Coverage Overview

| File | Statements | Functions | Branches | Priority | Effort | Impact |
|------|-----------|-----------|----------|----------|--------|--------|
| **mockApi.ts** | 23.68% | 33.33% | 28.57% | 🔴 CRITICAL | 4-5h | HIGH |
| **MatchLogic.tsx** | 27.47% | 17.14% | 16% | 🔴 CRITICAL | 8-10h | HIGH |
| **DestinationForm.tsx** | 26.79% | 18.75% | 33.33% | 🟠 HIGH | 5-6h | MEDIUM |
| **MalwareDetectionForm.tsx** | 37.93% | 15.38% | 25% | 🟠 HIGH | 4-5h | MEDIUM |
| **UrlListsForm.tsx** | 26.09% | 33.33% | 30% | 🟡 MEDIUM | 4-5h | MEDIUM |
| **CustomCategoriesForm.tsx** | 45.45% | 25% | 50% | 🟡 MEDIUM | 1-2h | HIGH |
| **FingerprintRulesForm.tsx** | 50% | 50% | 50% | 🟢 LOW | 1-2h | MEDIUM |

---

## Implementation Priority

### Phase 1: Quick Wins (4-5 hours) → +15-20% coverage
1. **mockApi.ts - Happy Paths** (2 hours)
   - Test successful fetchProfile()
   - Test successful deleteProfile()
   - Test successful fetchProfiles()

2. **CustomCategoriesForm** (1 hour)
   - Form submission with name
   - Description handling

3. **FingerprintRulesForm** (1-2 hours)
   - Threshold slider changes
   - Form submission with threshold

### Phase 2: Core Coverage (8-10 hours) → +30-35% coverage
1. **mockApi.ts - Error Handling** (4-5 hours)
   - Network failures
   - HTTP error codes (404, 500, 403)
   - All filter combinations

2. **MatchLogic.tsx - Handler Functions** (4-5 hours)
   - handleRuleChange()
   - handleValueToggle()
   - handleSelectAll()
   - handleAddRule()
   - handleRemoveRule()

### Phase 3: Complex Components (10-12 hours) → +25-30% coverage
1. **DestinationForm.tsx** (6-7 hours)
   - File upload/download handlers
   - Definition textarea with row counting
   - TXT menu operations

2. **MatchLogic.tsx - Integration** (4-5 hours)
   - Multi-rule workflows
   - Group toggles
   - Navigation callbacks

### Phase 4: Remaining Forms (4-5 hours) → +10% coverage
1. **UrlListsForm.tsx** (2-3 hours)
2. **MalwareDetectionForm.tsx** (2-3 hours)

---

## Common Test Patterns

### Testing API Functions
```typescript
it('handles error response', async () => {
  global.fetch = vi.fn().mockResolvedValueOnce({
    ok: false,
    status: 404,
    statusText: 'Not Found'
  })

  await expect(mockApi.fetchProfile('1')).rejects.toThrow(
    'API error: 404 Not Found'
  )
})
```

### Testing Form Submission
```typescript
it('submits form with data', async () => {
  const user = userEvent.setup()
  const mockOnSubmit = vi.fn()

  render(<MyForm onSubmit={mockOnSubmit} />)

  await user.type(screen.getByLabelText('Name'), 'Test')
  await user.click(screen.getByText('Save'))

  expect(mockOnSubmit).toHaveBeenCalled()
})
```

### Testing State Changes
```typescript
it('updates state on user interaction', async () => {
  const user = userEvent.setup()
  const mockCallback = vi.fn()

  render(<MyComponent onChange={mockCallback} />)

  await user.type(screen.getByRole('textbox'), 'text')

  expect(mockCallback).toHaveBeenCalledWith('text')
})
```

### Testing File Uploads
```typescript
it('reads file content', async () => {
  const user = userEvent.setup()
  const file = new File(['test content'], 'test.txt')

  render(<FileUploadForm />)

  const input = screen.getByDisplayValue('')
  await user.upload(input, file)

  // Wait for FileReader
  await new Promise(r => setTimeout(r, 100))

  expect(screen.getByDisplayValue('test content')).toBeInTheDocument()
})
```

### Testing Conditional Rendering
```typescript
it('shows element based on prop', () => {
  const { rerender } = render(<MyComponent show={false} />)
  expect(screen.queryByText('Content')).not.toBeInTheDocument()

  rerender(<MyComponent show={true} />)
  expect(screen.getByText('Content')).toBeInTheDocument()
})
```

---

## Key Testing Libraries & Tools

### Vitest Setup
```bash
npm run test              # Run all tests
npm run test -- --watch  # Watch mode
npm run test -- --coverage  # With coverage report
```

### Main Testing Functions
- `render()` - Render component in jsdom
- `screen` - Query rendered DOM
- `userEvent` - Simulate user interactions
- `vi.fn()` - Create mock functions
- `vi.spyOn()` - Spy on existing functions

### Common Queries
```typescript
screen.getByText('text')           // Find by text content
screen.getByLabelText('label')     // Find by label
screen.getByRole('button')         // Find by ARIA role
screen.getByPlaceholderText('...')  // Find by placeholder
screen.getAllByRole('checkbox')    // Get all matching elements
screen.queryByText('text')         // Returns null if not found
```

### Common Assertions
```typescript
expect(element).toBeInTheDocument()
expect(element).toBeDisabled()
expect(element).toHaveValue('text')
expect(fn).toHaveBeenCalled()
expect(fn).toHaveBeenCalledWith(arg)
expect(promise).rejects.toThrow('error')
```

---

## Checklist: Before Committing Tests

- [ ] All tests pass: `npm run test`
- [ ] No console errors or warnings
- [ ] Coverage improved for target file
- [ ] Tests are isolated (no dependencies between tests)
- [ ] Mocks are cleaned up in afterEach
- [ ] Async operations properly awaited
- [ ] Descriptive test names (what, not how)
- [ ] No hardcoded wait times (use waitFor instead)
- [ ] No skipped tests (.skip or .only removed)

---

## File Locations for Reference

### Source Files
- `/Users/ajalbani/workflow-ux-profiles/src/api/mockApi.ts`
- `/Users/ajalbani/workflow-ux-profiles/src/components/MatchLogic/MatchLogic.tsx`
- `/Users/ajalbani/workflow-ux-profiles/src/components/forms/DestinationForm/DestinationForm.tsx`
- `/Users/ajalbani/workflow-ux-profiles/src/components/forms/CustomCategoriesForm/CustomCategoriesForm.tsx`
- `/Users/ajalbani/workflow-ux-profiles/src/components/forms/FingerprintRulesForm/FingerprintRulesForm.tsx`
- `/Users/ajalbani/workflow-ux-profiles/src/components/forms/UrlListsForm/UrlListsForm.tsx`
- `/Users/ajalbani/workflow-ux-profiles/src/components/forms/MalwareDetectionForm/MalwareDetectionForm.tsx`

### Test Files
- `/Users/ajalbani/workflow-ux-profiles/src/api/mockApi.test.ts` (CREATE NEW)
- `/Users/ajalbani/workflow-ux-profiles/src/components/MatchLogic/MatchLogic.test.tsx`
- `/Users/ajalbani/workflow-ux-profiles/src/components/forms/DestinationForm/DestinationForm.test.tsx`
- `/Users/ajalbani/workflow-ux-profiles/src/components/forms/CustomCategoriesForm/CustomCategoriesForm.test.tsx`
- `/Users/ajalbani/workflow-ux-profiles/src/components/forms/FingerprintRulesForm/FingerprintRulesForm.test.tsx`
- `/Users/ajalbani/workflow-ux-profiles/src/components/forms/UrlListsForm/UrlListsForm.test.tsx`
- `/Users/ajalbani/workflow-ux-profiles/src/components/forms/MalwareDetectionForm/MalwareDetectionForm.test.tsx`

### Documentation Files
- `/Users/ajalbani/workflow-ux-profiles/COVERAGE_ANALYSIS_AND_RECOMMENDATIONS.md` (detailed analysis)
- `/Users/ajalbani/workflow-ux-profiles/COVERAGE_TEST_TEMPLATES.md` (copy-paste test code)
- `/Users/ajalbani/workflow-ux-profiles/COVERAGE_QUICK_REFERENCE.md` (this file)

---

## Top 3 Most Important Test Cases to Add

### 1. mockApi.ts - Test Success Paths (Highest ROI)
- fetchProfile with valid ID
- deleteProfile successfully
- fetchProfiles with pagination

**Why**: These are critical functions; uncovered means bugs go to production

### 2. MatchLogic.tsx - Test handleSelectAll()
- Select all options behavior
- Deselect all behavior
- Works for both Category and URL/Destination fields

**Why**: Commonly used feature, complex state logic with many branches

### 3. DestinationForm.tsx - Test File Handling
- File upload reads content
- Content appends to existing
- Download triggers correctly

**Why**: File operations are error-prone; critical for data integrity

---

## Incremental Implementation Strategy

### Week 1
- Add mockApi happy path tests (2h)
- Add CustomCategoriesForm tests (1h)
- Add FingerprintRulesForm tests (1h)
- **Result**: 3-4 new files with increased coverage

### Week 2
- Add mockApi error handling (4-5h)
- Add MatchLogic handler tests (4-5h)
- **Result**: mockApi 80%+, MatchLogic 70%+

### Week 3
- Complete DestinationForm tests (6h)
- **Result**: DestinationForm 80%+

### Week 4
- Complete MatchLogic integration tests (4h)
- Add UrlListsForm tests (3h)
- **Result**: Overall 75%+

---

## Troubleshooting Common Issues

### Issue: Test hangs on FileReader
**Solution**: Mock FileReader or use setTimeout to wait for async read
```typescript
await new Promise(r => setTimeout(r, 100))
```

### Issue: userEvent not triggering onChange
**Solution**: Make sure input is controlled and handler is connected
```typescript
// Bad: uncontrolled input
<input onChange={handler} />

// Good: controlled input
const [value, setValue] = useState('')
<input value={value} onChange={e => setValue(e.target.value)} />
```

### Issue: Component not found in render
**Solution**: Check if element is rendered conditionally or requires props
```typescript
// If component requires props
render(<Component requiredProp={value} />)

// If element is hidden initially
const expandBtn = screen.getByText('Expand')
userEvent.click(expandBtn)
const hiddenElement = screen.getByText('Previously hidden')
```

### Issue: Tests timing out
**Solution**: Check for infinite loops or unresolved promises
```typescript
// Make sure all async operations are awaited
await userEvent.type(...)
await screen.findByText(...)  // Waits for element to appear
```

---

## Success Metrics

### Coverage Targets
- **Target Overall**: 80% statement coverage
- **Target mockApi.ts**: 85%+
- **Target MatchLogic.tsx**: 80%+
- **Target DestinationForm.tsx**: 80%+

### Quality Metrics
- Zero flaky tests (no random failures)
- Tests run in <5 minutes total
- No console warnings in test output
- All error paths tested

---

## Next Steps

1. Read `COVERAGE_ANALYSIS_AND_RECOMMENDATIONS.md` for detailed analysis
2. Review `COVERAGE_TEST_TEMPLATES.md` for copy-paste ready code
3. Start with Phase 1 (Quick Wins) to build momentum
4. Track progress by running: `npm run test -- --coverage`
5. Commit tests incrementally with clear commit messages

---

## Quick Command Reference

```bash
# Run tests with coverage report
npm run test -- --coverage

# Run specific test file
npm run test -- src/api/mockApi.test.ts

# Watch mode for development
npm run test -- --watch

# Update snapshots
npm run test -- -u

# Run with verbose output
npm run test -- --reporter=verbose
```

---

## Resources

- [Testing Library React Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Documentation](https://vitest.dev/)
- [userEvent API](https://testing-library.com/docs/user-event/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Last Updated**: 2024
**Files Modified**: COVERAGE_ANALYSIS_AND_RECOMMENDATIONS.md, COVERAGE_TEST_TEMPLATES.md, COVERAGE_QUICK_REFERENCE.md

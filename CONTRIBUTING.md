# Contributing

Every substantive change must go through PR → Qodo review → fix → re-review → merge.

1. Branch from main: `git checkout -b feat/xyz`
2. Commit, push, open PR via `gh pr create`
3. Comment `/agentic_review` if Qodo not auto
4. Fix Highs, dismiss with reason if false positive
5. Push fix, comment `/agentic_review` again
6. Human merges only after Qodo shows resolved + follow-up review

Direct pushes to main are not counted as reviewed work.

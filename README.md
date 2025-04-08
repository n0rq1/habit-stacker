# Habit-stacker API

Uses Semantic Release Versioning and the workflow automatically updates it given keywords in the commit messages:

`fix` will do v1.0.1 -> v1.0.2
- Fix Release
  - Example commit message: `fix: Cleaned up index.js`

`feat` will do v1.0.1 -> v1.1.0
- Feature Release
  - Example commit message: `feat: Added new route`
  
`fix/feat` with the footer `BREAKING CHANGE` will do v1.0.1 -> v2.0.0
- Breaking Release (Note that the BREAKING CHANGE:  token must be in the footer of the commit)
  - Example commit message: `feat: Changed User model to work with DB *line break x 2* BREAKING CHANGE: Explanation ...`


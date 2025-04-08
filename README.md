# Habit-stacker API

Uses Semantic Release Versioning and the workflow automatically updates it given keywords in the commit messages:
`fix` will do v1.0.1 -> v1.0.2
- Fix Release
`feat` will do v1.0.1 -> v1.1.0
- Feature Release
`fix/feat` with the footer `BREAKING CHANGE` will do v1.0.1 -> v2.0.0
- Breaking Release (Note that the BREAKING CHANGE:  token must be in the footer of the commit)



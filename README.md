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
  
***

If running the container locally, use:
`docker build -t habit .`
To build the image

`docker run --env-file .env -p 8080:8080 habit`
To run the container

You should see:
```
austin$ docker run --env-file .env -p 8080:8080 habit
✅ Server is running on port 8080
DB Connected
```

Now, you should be able to test the endpoints:

`http://localhost:8080/api/auth/signup`
`http://localhost:8080/api/auth/signin`
`http://localhost:8080/api/auth/signout`


*****************************************

**Project Documents**

- [Product Proposal](https://docs.google.com/document/d/13_lSkfmK4cV-l-Co1RNPAEhdlOhNlCM0/edit)  
- [Internal Design](https://docs.google.com/document/d/1AmOUsioLiw_CAnF9eLuuR1trGjVwm-1SHmkSmQE3_cg/edit?tab=t.0)  
- [External Design](https://docs.google.com/document/d/1lZNVLpX_luz6rVLiwemglfco1gv0rWs8y4wzmMU0Llo/edit?tab=t.0)  
- [Figma](https://www.figma.com/design/EtuGrpGSvyTrsFFtT8VKTa/Habit-Tracker-App-UI%2FUX?node-id=358-50&p=f)  
- [Product Backlog](https://docs.google.com/document/d/1617Mwk4ZlWEIDIaQMpH8vLD2Z3l_zb2ckR7A4nox0V4/edit?pli=1&tab=t.sxc5dpr5dhan#heading=h.j8sfn79ym50v)

*****************************************

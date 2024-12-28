# awesome-github-ui

This is the frontend (backend [here](https://github.com/ajeecai/awesome-github-srv)) of a cloud hosted service which provides interesting insights of GitHub resource:

- Current number of repositories under different language categories.
- Repository star trending of each language.
- Newsletters sent to the topic subscribers weekly.
- Some funny anecdote about open source code in GitHub.
- An experiment talking with chatgpt about GitHub (or something else).

Service running on a free aws account with limited quota: https://asgithub.com

![image](https://github.com/user-attachments/assets/5b4bd4b4-678f-4fee-a616-7bf7ec7731b8)

If you like to receive newsletters weekly by email, please click the button:

![image](https://github.com/user-attachments/assets/a4ee5eb2-3f3e-45f1-988c-c3d1e8b17341)

## motivation

see [here](https://asgithub.com/about)

## technology

Vue3 + vuex, aws static web hosting + CloudFront

## Todo

- Try best... but vuex doesn't work well with typing, use `any` in some places. Or change to official store pinia. Vuex is too cumbersome, mutation, actions... unnecessary.
- Currently use options API, should migrate to composition API.
- Not good at css now, should build responsive page.
- reCaptcha loading is slow, so that login looks like no response sometimes.
- analyze the web loading performance...

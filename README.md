## Dev Tinder frontend

- Create next js application
- To create a login page
- Install axios
- Install cors in backend => add middleware to the app with configuration:origin and credentials:true
- Whenever you are making api call so pass axios => { withCredentials: true }
- Install redux toolkit (npm i @reduxjs/toolkit react-redux)
- Install react-redux + @reduxjs/toolkit => configureStore => Provider => createSlice => add reducer to store
- You should not be able to access other routes without login
- If the token is not valid redirect the user to login page
- Logout feature
- Feed feature
- Profile edit
- Toast messages
- connectios page

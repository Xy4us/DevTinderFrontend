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
- Request page and its interested and rejected thingh also done
- Send and ignored the connection req page as well
- Signup  page logic 
- E2E testing 

# Deployment

- SignUp on AWS 
- Launch an instance 
- Create a key value pair
- chmod 400 <secret>.pem
- connected to the machine using ssh 
- now we will setup the project onto the machine

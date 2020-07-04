# ![](web/public/assets/signin.png)

<br/>
  
> GoBarber is a full-fledged application using the OmniStack (Node.js, React and ReactNative). It´s an application where the providers can register and make check their own schedule on the web application and the clients can use the mobile platform to schedule services.

## Backend

To run the backend, execute this command:

```
cd backend
yarn
yarn start
```

Technologies used

- Node.js
- TypeOrm
- Postgres
- Handlebars to create templates and send mail
- Redis to cache some responses
- MongoDB for the notifications
- Celebrate for api params validations
- Jest for testing

## FrontEnd

To run the frontend, execute this command:
<br />

```
cd frontend
yarn install
yarn start
```

Technologies used

- React JS
- React Router
- Feather Icons
- Axios
- Unform for the form binding
- React day picker to create custom day picker
- Yup for form validation
- Jest for testing

## Mobile

To run the mobile app, execute this command:

```
cd mobile
yarn
yarn ios or yarn android
```

Technologies used

- React Native
- React Native Router
- Axios
- Feather Icons
- Yup for form validation
- Unform for the form binding
- React native image picker to take photo or choose some photo on the library
- Jest for testing
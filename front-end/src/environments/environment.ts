const baseServiceURL = 'http://localhost';

const environment = {
  servicesURL: {
    main: `${baseServiceURL}:3000/`,
    authentication: `${baseServiceURL}:3001/`,
    restaurant: `${baseServiceURL}:3002/`
  },
  production: false,
  encryptKey: 'D1g!t@lWa1t3r#Request' // change to your key when deploying to production
}

export default environment;

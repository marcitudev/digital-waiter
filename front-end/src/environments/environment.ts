const baseServiceURL = 'http://localhost';

const environment = {
  servicesURL: {
    main: `${baseServiceURL}:3000/`,
    authentication: `${baseServiceURL}:3001/`,
    restaurant: `${baseServiceURL}:3002/`
  },
  production: false
}

export default environment;

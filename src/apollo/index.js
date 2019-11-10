import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'https://react.eogresources.com/graphql',
});

export default client;
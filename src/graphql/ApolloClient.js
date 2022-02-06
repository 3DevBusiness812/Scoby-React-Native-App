/* eslint-disable no-plusplus */
import {useContext} from 'react';
import {ApolloClient, ApolloLink, Observable} from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';
import {API_ROOT, WEBSOCKET_URL} from 'src/config/api';
import {createUploadLink} from 'apollo-upload-client';
import {WebSocketLink} from '@apollo/client/link/ws';
import {split} from 'apollo-link';
import {getMainDefinition} from '@apollo/client/utilities';
import {InMemoryCache} from '@apollo/client/cache';
import {onError} from 'apollo-link-error';
import {GlobalContext} from 'src/containers/global';

const userSessionErrors = ['ERR_JWT_INVALID_OR_EXPIRED', 'ERR_UNAUTHORIZED'];

const orderQueryRefresh = (existing, incoming, isReference, readField) => {
  if (existing) {
    const processedIDs = [];
    const data = [];

    for (let index = 0, count = existing.data.length; index < count; index++) {
      const user = existing.data[index];
      const id = isReference(user) ? readField({fieldName: 'id', from: existing.data[index]}) : user.id;
      data.push(user);
      processedIDs.push(id);
    }

    for (let index = 0, count = incoming.data.length; index < count; index++) {
      const user = incoming.data[index];
      const id = isReference(user) ? readField({fieldName: 'id', from: incoming.data[index]}) : user.id;
      if (!processedIDs.includes(id)) {
        data.push(user);
      }
    }

    /*     data = data.sort((first, second) => {
      const firstCreatedAt = isReference(first) ? readField({fieldName: 'createdAt', from: first}) : first.createdAt;
      const secondCreatedAt = isReference(second)
        ? readField({fieldName: 'createdAt', from: second})
        : second.createdAt;
      return firstCreatedAt < secondCreatedAt ? 1 : -1;
    }); */

    return {
      ...incoming,
      data,
    };
  }
  return incoming;
};

export default function useApolloClient() {
  const {setIsLogged} = useContext(GlobalContext);

  const uploadLink = createUploadLink({
    uri: API_ROOT,
  });

  const wsLink = new WebSocketLink({
    uri: WEBSOCKET_URL,
    options: {
      reconnect: true,
      connectionParams: async () => {
        const token = await AsyncStorage.getItem('token');
        return {Authorization: `Bearer ${token}`};
      },
    },
  });

  const splitLink = split(
    ({query}) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    uploadLink,
  );

  const errorLink = onError(({response, graphQLErrors = [], operation, forward}) => {
    if (userSessionErrors.includes(graphQLErrors[0]?.extensions?.code)) {
      response.expiredToken = true;
      setIsLogged(false);
    }
    return forward(operation);
  });

  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        AsyncStorage.getItem('token')
          .then((token) => {
            operation.setContext({
              headers: {
                authorization: token ? `Bearer ${token}` : '',
              },
            });
          })
          .then(() => {
            const subscriber = {
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            };
            forward(operation).subscribe(subscriber);
          })
          .catch((err) => {
            observer.error(err);
          });
      }),
  );

  return new ApolloClient({
    link: ApolloLink.from([requestLink, errorLink, splitLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getUsers: {
              merge(existing, incoming, {isReference, readField}) {
                return orderQueryRefresh(existing, incoming, isReference, readField);
              },
              keyArgs: ['query'],
            },
            getActivity: {
              merge(existing, incoming, {isReference, readField}) {
                return orderQueryRefresh(existing, incoming, isReference, readField);
              },
              keyArgs: false,
            },
            getSeriesAndSession: {
              merge(existing, incoming, {args, readField}) {
                if (args.paging.page === 1) {
                  return {...incoming};
                }
                const series = existing?.series ? existing.series.slice(0) : [];
                // Obtain a Set of all existing task IDs.
                const existingIdSetSeries = new Set(series.map((task) => readField('id', task)));
                // Remove incoming tasks already present in the existing data.
                const incomingSeries = incoming.series.filter(
                  (task) => !existingIdSetSeries.has(readField('id', task)),
                );

                const afterIndexSeries = series.findIndex((task) => args.afterId === readField('id', task));
                if (afterIndexSeries >= 0) {
                  // If we found afterIndexSeries, insert incoming after that index.
                  series.splice(afterIndexSeries + 1, 0, ...incomingSeries);
                } else {
                  // Otherwise insert incoming at the end of the existing data.
                  series.push(...incomingSeries);
                }

                const session = existing?.session ? existing.session.slice(0) : [];
                // Obtain a Set of all existing task IDs.
                const existingIdSetsession = new Set(session.map((task) => readField('id', task)));
                // Remove incoming tasks already present in the existing data.
                const incomingsession = incoming.session.filter(
                  (task) => !existingIdSetsession.has(readField('id', task)),
                );

                const afterIndexsession = session.findIndex((task) => args.afterId === readField('id', task));
                if (afterIndexsession >= 0) {
                  // If we found afterIndexSeries, insert incoming after that index.
                  session.splice(afterIndexsession + 1, 0, ...incomingsession);
                } else {
                  // Otherwise insert incoming at the end of the existing data.
                  session.push(...incomingsession);
                }

                const seriesLive = existing?.seriesLive ? existing.seriesLive.slice(0) : [];
                // Obtain a Set of all existing task IDs.
                const existingIdSetSeriesLive = new Set(seriesLive.map((task) => readField('id', task)));
                // Remove incoming tasks already present in the existing data.
                const incomingSeriesLive = incoming.seriesLive.filter(
                  (task) => !existingIdSetSeriesLive.has(readField('id', task)),
                );

                const afterIndexSeriesLive = seriesLive.findIndex((task) => args.afterId === readField('id', task));
                if (afterIndexSeriesLive >= 0) {
                  // If we found afterIndexSeries, insert incoming after that index.
                  seriesLive.splice(afterIndexSeriesLive + 1, 0, ...incomingSeriesLive);
                } else {
                  // Otherwise insert incoming at the end of the existing data.
                  seriesLive.push(...incomingSeriesLive);
                }

                return {
                  ...incoming,
                  seriesLive: [...seriesLive],
                  session: [...session],
                  series: [...series],
                };
              },
              keyArgs: [],
            },
          },
        },
      },
    }),
  });
}

import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { FlatList, View, ListRenderItemInfo } from 'react-native';
import tailwind from 'tailwind-rn';
import { ListCardsQuery, GetCardQuery } from '../../API';
import { listCards } from '../../graphql/queries';
import SingleCard from './SingleCard';

const CardList = () => {
  const { data } = useQuery<ListCardsQuery>(
    gql`
      ${listCards}
    `,
    { fetchPolicy: 'cache-and-network', nextFetchPolicy: 'cache-first' }
  );

  const renderItem = ({ item }: ListRenderItemInfo<GetCardQuery['getCard']>) => {
    if (item) {
      return <SingleCard name={item.name} coverImage={item.coverImage} />;
    }

    return null;
  };

  const cardList = data && data.listCards && data.listCards.items && (
    <FlatList
      data={data.listCards.items}
      renderItem={renderItem}
      keyExtractor={(item) => item?.id as string}
    />
  );

  return <View style={tailwind('flex-1 flex-1 bg-gray-100')}>{cardList}</View>;
};

export default CardList;

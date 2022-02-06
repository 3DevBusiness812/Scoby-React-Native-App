import React from 'react';
import styled from 'styled-components/native';
import avatarSrc from 'assets/images/profile/avatarPlaceholder.png';
import Colors from 'src/constants/Colors';
import Fonts from 'src/constants/Fonts';

const Container = styled.View({
  marginHorizontal: 15,
  backgroundColor: Colors.white,
  borderRadius: 5,
});

const Name = styled.Text({
  fontFamily: Fonts.avenirBold.fontFamily,
  color: Colors.black,
  marginTop: 35,
  marginLeft: '20%',
  fontSize: 17,
});

const FullName = styled.Text({
  fontFamily: Fonts.avenirBold.fontFamily,
  color: Colors.black,
});

const Description = styled.Text({
  fontFamily: Fonts.avenir.fontFamily,
  color: Colors.black,
  width: '59%',
});

const PhotoContainer = styled.View({
  alignItems: 'center',
});

const PhotoDescriptionContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  marginVertical: 20,
});

const Photo = styled.Image({
  width: 75,
  height: 75,
  borderRadius: 100,
  borderWidth: 3,
  borderColor: Colors.newPink,
});

const TopicText = styled.Text({
  color: Colors.purple,
  marginVertical: 5,
  marginHorizontal: 3,
  backgroundColor: `${Colors.purple}80`,
  borderRadius: 5,
  paddingVertical: 5,
  paddingHorizontal: 7,
});

const TopicContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginBottom: 20,
  marginHorizontal: 10,
  justifyContent: 'flex-start',
});

const setTopics = (topics) => {
  const setUniqueKey = (index) => `feed-${index}-${Math.random()}`;
  return topics.map((item, index) => (
    <TopicText key={setUniqueKey(index)}>
      {item.icon} {item.name}
    </TopicText>
  ));
};

const FeedItem = ({item}) => {
  const {username, avatar} = item.currentUserProfile;
  const ownerUserAvatarUrl = avatar ? {uri: avatar} : avatarSrc;
  const {name, description, topics} = item;

  return (
    <Container>
      <Name>{name}</Name>
      <PhotoDescriptionContainer>
        <PhotoContainer>
          <Photo source={ownerUserAvatarUrl} />
          <FullName>@{username}</FullName>
        </PhotoContainer>
        <Description>{description}</Description>
      </PhotoDescriptionContainer>
      <TopicContainer>{setTopics(topics)}</TopicContainer>
    </Container>
  );
};

export default FeedItem;

/* eslint-disable */
import React from 'react';
import {
  DogIco,
  ArchitectureIco,
  ArtIco,
  Bookco,
  StartupsIco,
  ClimateIco,
  CraftsIco,
  EducationIco,
  HumorIco,
  FitnessIco,
  CookingIco,
  GamingIco,
  HealthIco,
  FashionIco,
  MusicIco,
  MediaIco,
  FamilyIco,
  PhotoIco,
  PoliticsIco,
  ProsperityIco,
  ScienceIco,
  RelationshipsIco,
  ShoppingIco,
  SpiritualityIco,
  SportsIco,
  TravelIco,
} from 'assets/ico';

export const getTopicImg = (string) => {
  if (!string || string === '') {
    return null;
  }

  if (string.match(/Animals/gi)) {
    return <DogIco />;
  }
  if (string.match(/Architecture/gi)) {
    return <ArchitectureIco />;
  }
  if (string.match(/Art/gi)) {
    return <ArtIco />;
  }
  if (string.match(/Books/gi)) {
    return <Bookco />;
  }
  if (string.match(/Startups/gi)) {
    return <StartupsIco />;
  }
  if (string.match(/Climate/gi)) {
    return <ClimateIco />;
  }
  if (string.match(/Crafts/gi)) {
    return <CraftsIco />;
  }
  if (string.match(/Education/gi)) {
    return <EducationIco />;
  }
  if (string.match(/Humor/gi)) {
    return <HumorIco />;
  }
  if (string.match(/Fitness/gi)) {
    return <FitnessIco />;
  }
  if (string.match(/Cooking/gi)) {
    return <CookingIco />;
  }
  if (string.match(/Gaming/gi)) {
    return <GamingIco />;
  }
  if (string.match(/Health/gi)) {
    return <HealthIco />;
  }
  if (string.match(/Fashion/gi)) {
    return <FashionIco />;
  }
  if (string.match(/Music/gi)) {
    return <MusicIco />;
  }
  if (string.match(/Media/gi)) {
    return <MediaIco />;
  }
  if (string.match(/Family/gi)) {
    return <FamilyIco />;
  }
  if (string.match(/Photo/gi)) {
    return <PhotoIco />;
  }
  if (string.match(/Politics/gi)) {
    return <PoliticsIco />;
  }
  if (string.match(/Prosperity/gi)) {
    return <ProsperityIco />;
  }
  if (string.match(/Science/gi)) {
    return <ScienceIco />;
  }
  if (string.match(/Relationships/gi)) {
    return <RelationshipsIco />;
  }
  if (string.match(/Shopping/gi)) {
    return <ShoppingIco />;
  }
  if (string.match(/Spirituality/gi)) {
    return <SpiritualityIco />;
  }
  if (string.match(/Sports/gi)) {
    return <SportsIco />;
  }
  if (string.match(/Travel/gi)) {
    return <TravelIco />;
  }
};

import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import {debounce} from 'throttle-debounce';
import Input from 'src/components/Input';
import styled from 'styled-components/native/dist/styled-components.native.esm';
import {getCurrentPosition} from 'src/utils/location';
import {height} from 'src/constants/Layout';
import Fonts from 'src/constants/Fonts';
import Colors from 'src/constants/Colors';
import {GOOGLE_API_KEY} from 'src/config/common';

const DELTA = 0.0123;

const Wrapper = styled.View({
  marginHorizontal: 24,
});

const MapWrapper = styled.ScrollView``;

const ButtonText = styled.Text({
  ...Fonts.avenir,
  fontSize: 16,
  lineHeight: '24px',
  letterSpacing: '0px',
  textAlign: 'left',
  color: Colors.white,
});

const ButtonDescriptionText = styled.Text({
  ...Fonts.avenir,
  fontSize: 13,
  lineHeight: '20px',
  letterSpacing: '0px',
  textAlign: 'left',
  color: '#9094a2',
});

const Item = styled.View`
  margin-bottom: 16px;
`;

const MapContainer = styled.View({
  height: height / 3,
  marginHorizontal: 24,
  borderRadius: 4,
  overflow: 'hidden',
  backgroundColor: Colors.white,
});

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default class Map extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: null,
        longitude: null,
      },
      destination: '',
      address: props.location || '',
      predictions: [],
    };
    this.onSubmit = debounce(1000, this.onSubmitSearch);
  }

  async componentDidMount() {
    const {address} = this.state;

    const currentPosition = await getCurrentPosition();
    const {latitude, longitude} = currentPosition;

    !!address && this.geoCoder(this.state.address);
    !address && this.setState({region: {latitude, longitude}});
  }

  onChangeDestination(destination) {
    this.setState({destination}, () => this.onSubmit(this.state.destination));
  }

  async onSubmitSearch(destination) {
    // eslint-disable-next-line max-len
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${destination}&location=${this.state.region.latitude},${this.state.region.longitude}&radius=500&stricbounds&key=${GOOGLE_API_KEY}`;
    try {
      const result = await fetch(apiUrl);
      const json = await result.json();

      this.setState(
        {
          predictions: json.predictions,
        },
        () => this.props.setValidLocation(true),
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  }

  geoCoder(address) {
    this.props.setLocation(address);

    Geocoder.from(address)
      .then((json) => {
        const {location} = json.results[0].geometry;
        this.setState({
          destination: address,
          region: {
            latitude: location.lat,
            longitude: location.lng,
          },
        });
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.warn(error));
  }

  render() {
    const {region, address, destination, predictions} = this.state;

    return (
      <MapWrapper>
        <MapContainer>
          {region.latitude && region.longitude && (
            <MapView
              loadingEnabled
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              showsPointsOfInterest
              showsUserLocation
              followsUserLocation
              showsTraffic={false}
              zoomEnabled={false}
              zoomTapEnabled={false}
              zoomControlEnabled={false}
              minZoomLevel={16}
              maxZoomLevel={16}
              rotateEnabled={false}
              scrollEnabled={false}
              pitchEnabled={false}
              showsMyLocationButton={false}
              region={{
                ...region,
                latitudeDelta: DELTA,
                longitudeDelta: DELTA,
              }}>
              <MapView.Marker coordinate={region} />
              <MapView.Circle center={region} radius={27} strokeWidth={2.5} strokeColor="red" fillColor="#B9B9B9" />
            </MapView>
          )}
        </MapContainer>
        <Wrapper>
          <Input
            placeholder={address}
            value={destination}
            maxLength={170}
            onChangeText={(data) => this.onChangeDestination(data)}
          />
          <MapWrapper>
            {predictions.length > 0 &&
              predictions.map((prediction, i) => (
                <TouchableOpacity
                  key={Math.random() + i.toString()}
                  onPress={() => {
                    this.props.setValidLocation(false);
                    this.setState({predictions: []});
                    this.geoCoder(prediction.description);
                  }}>
                  <Item>
                    <ButtonText>{prediction.structured_formatting.main_text}</ButtonText>
                    <ButtonDescriptionText>{prediction.description}</ButtonDescriptionText>
                  </Item>
                </TouchableOpacity>
              ))}
          </MapWrapper>
        </Wrapper>
      </MapWrapper>
    );
  }
}

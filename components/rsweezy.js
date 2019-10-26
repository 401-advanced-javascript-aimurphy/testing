// source dad joke swiper https://snack.expo.io/B1N7JqT_G

import React from "react";
import { StyleSheet, SafeAreaView, View, Text, Dimensions, StatusBar } from "react-native";
import Swiper from 'react-native-deck-swiper';

const window = Dimensions.get('window');

export default class Ron extends React.Component {
  state = {
    mathTrivia: [],
    triviaIds: {},
    cardIndex: 0,
    swipedAll: false,
  };

  componentDidMount() {
    Promise.all([this.newTrivia(), this.newTrivia(), this.newTrivia()])
      .then(mathTrivia => {
        this.setState({
          mathTrivia,
        });
    })
  }

  newTrivia = () => {
    return fetch("http://ron-swanson-quotes.herokuapp.com/v2/quotes", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "React Native Example"
      }
    })
      .then(res => res.json())
      .then(trivia => {
        if (this.state.triviaIds[trivia]) {
          return this.newTrivia();
        }

        this.setState((prevState) => ({
          triviaIds: {
            ...prevState.triviaIds,
            [trivia]: true,
          }
        }));

        return trivia;
      });
  };

  newTriviaOnSwipe = (cardIndex) => {
    this.setState({ cardIndex: cardIndex + 1 });
    // if (cardIndex < 5) {
      this.newTrivia()
        .then(trivia => {
          this.setState(prevState => ({
            mathTrivia: [...prevState.mathTrivia, trivia]
          }));
        });
    // }
  };

  handleSwipedAll = () => {
    this.setState({ swipedAll: true });
  }

  rendermathTrivia = () => {
    return (
      <Swiper
        onSwiped={this.newTriviaOnSwipe}
        cards={this.state.mathTrivia}
        cardIndex={this.state.cardIndex}
        onSwipedAll={this.handleSwipedAll}
        renderCard={trivia => {
          if (trivia) {
            return (
              <View key={trivia.id} style={styles.cardContainer}>
                <View style={styles.card}>
                  <Text style={styles.cardText}>{trivia}</Text>
                </View>
              </View>
            );
          }

          return null;
        }}
      />
    );
  };

  renderSwipedAll = () => {
    return (
      <View style={styles.noMoremathTrivia}>
        <Text style={styles.noMoreText}>That's all folks!</Text>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor="#ecf0f1"
          barStyle="light-content"
        />
        {this.rendermathTrivia()}
        {this.state.swipedAll && this.renderSwipedAll()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cardContainer: {
    // backgroundColor: 'transparent',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    height: window.height * 0.5,
    width: window.width * 0.9,
    borderRadius: 400,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  cardText: {
    fontSize: 20,
  },
  noMoremathTrivia: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noMoreText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold'
  },
});

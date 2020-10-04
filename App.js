
import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, View, Text,Alert} from 'react-native';
import params from './src/params'
// import Field from './src/components/Field'
import MineField from './src/components/MineField'
import Header from './src/components/Header'
import LevelSelection from './src/screens/LevelSelection'
import {
  createMinedBoard,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
  flagsUsed,
} from './src/function'

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = this.createState()
  }

  minesAmount = () => {
    const cols = params.getColumnsAmount()
    const rows = params.getRowsAmount()
    return Math.ceil(cols * rows * params.difficultLevel)
  }

  createState = () => {
    const cols = params.getColumnsAmount()
    const rows = params.getRowsAmount()
    return {
      board: createMinedBoard(rows, cols, this.minesAmount()),
      won: false,
      lost: false,
      showLevelSelection: false,
    }
  }

  onOpenField = (row, column) => {
    const board = cloneBoard(this.state.board)
    openField(board, row, column)
    const lost = hadExplosion(board)
    const won = wonGame(board)

    if (lost) {
      showMines(board)
      Alert.alert('Perdeeeeu', 'Que buuurro!')
    }
    if(won){
      Alert.alert('Parabens', 'Voce Venceu!')
    }
    this.setState({board, lost, won})
  }

  onSelectField = (row, column) => {
    const board = cloneBoard(this.state.board)
    invertFlag(board, row, column)
    const won = wonGame(board)

    if(won) {
      Alert.alert('Parabens', 'Você venceu!')
    }
    this.setState({board, won})
  }

  onLevelSelected = level => {
    params.difficultLevel =  level
    this.setState(this.createState())
  }

  render(){
  return (
    <>
      <SafeAreaView style={styles.container}>
        <LevelSelection isVisible= {this.state.showLevelSelection}
        onLevelSelected={this.onLevelSelected}
        onCancel={() => this.setState({ showLevelSelection: false})} />
       <Header flagsLeft={this.minesAmount() - flagsUsed(this.state.board)}
       onNewGame={() => this.setState(this.createState())}
       onFlagPress={() => this.setState({ showLevelSelection: true})} />
     <View style= {styles.board}>
      <MineField board= {this.state.board} 
        onOpenField={this.onOpenField}
        onSelectField={this.onSelectField}/>  
     </View>
    { /*    <Field />
        <Field opened />
        <Field opened nearMines={1} />
        <Field opened nearMines={2} />
        <Field opened nearMines={3} />
        <Field opened nearMines={6} />
        <Field mined />
        <Field mined opened />
        <Field mined opened exploded />
        <Field flagged />
    <Field flagged opened /> */ }


      </SafeAreaView>
    </>
  );
}
}

const styles = StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: 'flex-end',
   },
   board: {
     alignItems: 'center',
     backgroundColor: '#AAA',
   },
  /* container:{
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF'
    },
    Welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }, */
});
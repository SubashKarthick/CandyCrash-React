import { useEffect, useState } from 'react'
import React from 'react'
// import blye from './ima'
import blueCandy from './images/blue-candy.png'
import greenCandy from './images/green-candy.png'
import orangeCandy from './images/orange-candy.png'
import purpleCandy from './images/purple-candy.png'
import redCandy from './images/red-candy.png'
import yellowCandy from './images/yellow-candy.png'
import blankCandy from './images/blank.png'
import ScoreBoard from './components/ScoreBoard.js'

const width=8
const candyColors =[
  blueCandy,orangeCandy,greenCandy,redCandy,yellowCandy,purpleCandy
]

const App = () => {

  const [currentColorArrangement,setCurrentColorArrangement] = useState([])
  const [sqBeenDragged,setSqBeenDragged] = useState(null)
  const [sqBeenReplaced,setSqBeenReplaced] = useState(null)
  const [scoreDisplay,setScoreDisplay] = useState(0)

  const checkForColumnsOfThree = () => {
    for(let i=0; i<= 47;i++){
      const sqOfThree = [i,i+8, i+8*2]
      const decideColor = currentColorArrangement[i]

      if(sqOfThree.every(sq => currentColorArrangement[sq] === decideColor)){
        // setScoreDisplay((score) => score + 3)
        sqOfThree.forEach(sq => currentColorArrangement[sq] = blankCandy)
        return true
      }
    }
  }

  const checkForColumnsOfThreeRows = () => {
    const notValid = [6,7,14,15,22,23, 30,31,28,29,46,47,54,54,63,64]
    for(let i =0; i < 64 ; i++ ) {
      const sqOfThreeRows = [i,i+1,i+2]
      const decideBet = currentColorArrangement[i]
      // console.log(i +" sum modulo" + ((i+1)%8 === 0));
      if(notValid.includes(i)) continue

      if(sqOfThreeRows.every(sq =>currentColorArrangement[sq] === decideBet)) {
        // setScoreDisplay((score) => score + 3)
        sqOfThreeRows.forEach(sq => currentColorArrangement[sq] = blankCandy)
        return true
      }
    }
  }

  const checkForColumnsOfFourRows = () => {
    const notValid = [5,6,7,13,14,15,21,22,23,29, 30,31,37,38,39,45,46,47,53,54,54,62,63,64]
    for(let i =0; i < 64 ; i++ ) {
      const sqOfFourRows = [i,i+1,i+2,i+3]
      const decideBet = currentColorArrangement[i]
      // console.log(i +" sum modulo" + ((i+1)%8 === 0));
      if(notValid.includes(i)) continue

      if(sqOfFourRows.every(sq =>currentColorArrangement[sq] === decideBet)) {
        // setScoreDisplay((score) => score + 4)
        sqOfFourRows.forEach(sq => currentColorArrangement[sq] = blankCandy)
        return true
      }
    }
  }


  const checkForColumnsOfFour = () => {
    for(let i=0; i<= 39 ;i++){
      const sqOfFour = [i,i+8, i+8*2, i+8*3]
      const decideColor = currentColorArrangement[i]

      if(sqOfFour.every(sq => currentColorArrangement[sq] === decideColor)){
        // setScoreDisplay((score) => score + 4)
        sqOfFour.forEach(sq => currentColorArrangement[sq] = blankCandy)
        return true
      }
    }
  }

  const moveIntoSqBelow = () => {
    const firstRow = [0,1,2,3,4,5,6,7]
    for(let i=0;i<=55;i++){
      const isFirstRow = firstRow.includes(i)

      if(isFirstRow && currentColorArrangement[i] === blankCandy){
        currentColorArrangement[i]= candyColors[Math.floor(Math.random() * candyColors.length)]
      }

      if(currentColorArrangement[i+width] ===blankCandy){
        currentColorArrangement[i+width] = currentColorArrangement[i]
        currentColorArrangement[i]=blankCandy
      }
    }
  }
  
  console.log("display score ---> "+scoreDisplay)

  useEffect(() =>{
    const timer = setInterval(() => {
      checkForColumnsOfFour()
      checkForColumnsOfFourRows()
      checkForColumnsOfThree()
      checkForColumnsOfThreeRows()
      moveIntoSqBelow()
      setCurrentColorArrangement([...currentColorArrangement])
    }, 1000)
    return () => clearInterval(timer)
  },[checkForColumnsOfFour,checkForColumnsOfFourRows,checkForColumnsOfThree, checkForColumnsOfThreeRows,moveIntoSqBelow,currentColorArrangement])

  useEffect(() => {
    createBoard()
  },[width])

  const createBoard = () => {
    const randowColorArrangement = []
      for(let i=0; i<width * width; i++) {
        const randomColors = candyColors[Math.floor(Math.random() * candyColors.length)]
        randowColorArrangement.push(randomColors)
      }
      console.log(randowColorArrangement)
      setCurrentColorArrangement(randowColorArrangement)
  }

  const dragStart = (e) => {
    // console.log(e.target)
    setSqBeenDragged(e.target)
    console.log('dragStart')
  }
  const dragDrop = (e) => {
    console.log(e.target)
    setSqBeenReplaced(e.target)
    console.log('drag Drop')
  }
  const dragEnd = (e) => {
    console.log('drag end')
    const dragId = parseInt(sqBeenDragged.getAttribute('data-id'))
    const replId = parseInt(sqBeenReplaced.getAttribute('data-id'))

    currentColorArrangement[replId]=sqBeenDragged.getAttribute('src')
    currentColorArrangement[dragId]=sqBeenReplaced.getAttribute('src')

    const validMoves = [
      dragId -1,
      dragId - width,
      dragId +1,
      dragId +width
    ]

    const isValidMv = validMoves.includes(replId)
    const isAcolmfour = checkForColumnsOfFour()
    const isARowFour = checkForColumnsOfFourRows()
    const isAColumThree = checkForColumnsOfThree()
    const isARowThree = checkForColumnsOfThreeRows()
    setScoreDisplay((score) => score + 1)
    if(replId && isValidMv && 
        (isAcolmfour || isARowFour || isAcolmfour || isAColumThree)) {
          
          setSqBeenDragged(null)
          setSqBeenReplaced(null)
        } else {
          currentColorArrangement[replId] = sqBeenReplaced.getAttribute('src')
          currentColorArrangement[dragId] = sqBeenDragged.getAttribute('src')
          setCurrentColorArrangement([...currentColorArrangement])
        }
    
  }

  return (    
    <div className="app">   
      <div className="game">
      {currentColorArrangement.map((candy, index ) => (
        <img key={index}
          src={candy}
          style={{ backgroundColor: candy }} 
          alt={candy}
          data-id ={index} 
          draggable={true}
          onDragStart={dragStart}
          onDragOver={(e:DragEvent<HTMLImageElement>) => e.preventDefault()}
          onDragEnter={(e:DragEvent<HTMLImageElement>) => e.preventDefault()}
          onDragLeave={(e:DragEvent<HTMLImageElement>) => e.preventDefault()}
          onDrop ={dragDrop}
          onDragEnd={dragEnd}
          />
      ))}
         
      </div>
      <ScoreBoard score={scoreDisplay}/>
    </div>
  )
}

export default App


const convertSecondToDuration = (totalSeconds) => {
     const hourse = Math.floor(totalSeconds / 3600)
     const minutes = Math.floor((totalSeconds % 3600) / 60)
     const seconds = Math.floor((totalSeconds % 3600) % 60)

     if (hourse > 0) {
          return `${hourse}h ${minutes}m`
     }if (minutes > 0) {
          return `${minutes}m ${seconds}s`
     } else {
          return `${seconds}s`
     }
}


export default convertSecondToDuration


import React from 'react'
import { useParams } from 'react-router-dom'

const VideoDetails = () => {
     const { courseID, sectionID, subSectionID } = useParams()
     console.log(courseID, sectionID, subSectionID)
     return (
          <div>VideoDetails</div>
     )
}

export default VideoDetails
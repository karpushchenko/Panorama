import { Viewer } from '@photo-sphere-viewer/core'
import {
  MarkerConfig,
  MarkersPlugin,
} from '@photo-sphere-viewer/markers-plugin'
import '@photo-sphere-viewer/markers-plugin/index.css'
import React, { memo, useRef } from 'react'
import { ReactPhotoSphereViewer, ViewerAPI } from 'react-photo-sphere-viewer'

interface Props {}

interface Room {
  image: string
  markers: MarkerConfig[]
}

// Define a marker for the company logo
const companyLogoMarker: MarkerConfig = {
  id: 'company-logo',
  position: { yaw: '0deg', pitch: '-90deg' }, // adjust pitch to position on the floor
  image: 'logo.svg',
  size: { width: 300, height: 300 },
}

const Panorama: React.FC<Props> = memo(() => {
  const panoRef = useRef<ViewerAPI>(null)
  const rooms: Record<string, Room> = {
    livingRoom: {
      image: 'living_room.jpg',
      markers: [
        {
          id: 'to-bathroom',
          image: 'bathroom_preview.jpg',
          position: { yaw: '-125deg', pitch: '0deg' },
          tooltip: 'Go to Bathroom',
          data: { target: 'bathroom' },
          size: { width: 50, height: 50 },
        },
        companyLogoMarker,
      ],
    },
    bathroom: {
      image: 'bathroom.jpg',
      markers: [
        {
          id: 'to-living',
          position: { yaw: '-165deg', pitch: '0deg' },
          tooltip: 'Back to Living Room',
          html: '🚪',
          data: { target: 'livingRoom' },
        },
        companyLogoMarker,
      ],
    },
  }

  const [currentRoom, setCurrentRoom] =
    React.useState<keyof typeof rooms>('livingRoom')

  const handleReady = (instance: Viewer) => {
    const markersPlugs: MarkersPlugin = instance.getPlugin(MarkersPlugin)
    if (!markersPlugs) return
    markersPlugs.addEventListener('select-marker', ({ marker }) => {
      if (marker.data?.target) {
        setCurrentRoom(marker.data.target)
        setTimeout(() => {
          markersPlugs.setMarkers(rooms[marker.data.target].markers)
        }, 1000)
      }
    })
  }

  return (
    <div
      style={{
        height: 'auto',
        width: '100%',
        flex: '1 1 100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h1>{currentRoom}</h1>
      <div style={{ position: 'relative', width: '100%', height: '70vh' }}>
        <ReactPhotoSphereViewer
          ref={panoRef}
          src={rooms[currentRoom].image}
          height="70vh"
          width="100%"
          plugins={[[MarkersPlugin, { markers: rooms[currentRoom].markers }]]}
          container="viewer"
          onClick={(e, viewer) => {
            console.log('click', e, viewer)
          }}
          onReady={handleReady}
        />
      </div>
    </div>
  )
})

Panorama.displayName = 'Panorama'

export default Panorama

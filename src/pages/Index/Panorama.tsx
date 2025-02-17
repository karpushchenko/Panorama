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

const roomDescription: Record<string, string> = {
  Soggiorno: 'Soggiorno con divano e TV',
  Cucina: 'Cucina con tavolo e sedie',
  Ripostiglio: 'Ripostiglio con scaffali e scatole',
  'Camera da letto': 'Camera matrimoniale con armadio',
  Bagno: 'Bagno con doccia',
}

// Define a marker for the company logo
const companyLogoMarker: MarkerConfig = {
  id: 'company-logo',
  position: { yaw: '0deg', pitch: '-90deg' }, // adjust pitch to position on the floor
  image: 'logo.png',
  size: { width: 300, height: 300 },
  tooltip: 'Your Company Logo',
}

const Panorama: React.FC<Props> = memo(() => {
  const panoRef = useRef<ViewerAPI>(null)
  const rooms: Record<string, Room> = {
    Soggiorno: {
      image: 'livingroom.jpeg',
      markers: [
        {
          id: 'to-kitchen',
          image: 'kitchen-preview.jpeg',
          position: { yaw: '0deg', pitch: '0deg' },
          tooltip: 'Vai in Cucina',
          data: { target: 'Cucina' },
          size: { width: 100, height: 100 },
        },
        {
          id: 'to-bedroom',
          image: 'bedroom-preview.jpeg',
          position: { yaw: '50deg', pitch: '0deg' },
          tooltip: 'Vai in Camera da letto',
          data: { target: 'Camera da letto' },
          size: { width: 100, height: 100 },
        },
        {
          id: 'to-storeroom',
          image: 'storeroom-preview.jpeg',
          position: { yaw: '31deg', pitch: '0deg' },
          tooltip: 'Vai in Ripostiglio',
          data: { target: 'Ripostiglio' },
          size: { width: 100, height: 100 },
        },
        companyLogoMarker,
      ],
    },
    Cucina: {
      image: 'kitchen.jpeg',
      markers: [
        {
          id: 'to-living',
          position: { yaw: '-10deg', pitch: '0deg' },
          tooltip: 'Vai in Soggiorno',
          image: 'livingroom-preview.jpeg',
          data: { target: 'Soggiorno' },
          size: { width: 100, height: 100 },
        },
        {
          id: 'to-bedroom',
          position: { yaw: '280deg', pitch: '0deg' },
          tooltip: 'Vai in Camera da letto',
          image: 'bedroom-preview.jpeg',
          data: { target: 'Camera da letto' },
          size: { width: 100, height: 100 },
        },
        {
          id: 'to-storeroom',
          position: { yaw: '245deg', pitch: '0deg' },
          tooltip: 'Vai in Ripostiglio',
          image: 'storeroom-preview.jpeg',
          data: { target: 'Ripostiglio' },
          size: { width: 100, height: 100 },
        },
        companyLogoMarker,
      ],
    },
    Ripostiglio: {
      image: 'storeroom.jpeg',
      markers: [
        {
          id: 'to-kitchen',
          position: { yaw: '-60deg', pitch: '0deg' },
          tooltip: 'Vai in Cucina',
          image: 'kitchen-preview.jpeg',
          data: { target: 'Cucina' },
          size: { width: 100, height: 100 },
        },
        {
          id: 'to-bathroom',
          position: { yaw: '130deg', pitch: '0deg' },
          tooltip: 'Vai in Bagno',
          image: 'bathroom-preview.jpeg',
          data: { target: 'Bagno' },
          size: { width: 100, height: 100 },
        },
        companyLogoMarker,
      ],
    },
    'Camera da letto': {
      image: 'bedroom.jpeg',
      markers: [
        {
          id: 'to-kitchen',
          position: { yaw: '145deg', pitch: '0deg' },
          tooltip: 'Vai in Cucina',
          image: 'kitchen-preview.jpeg',
          data: { target: 'Cucina' },
          size: { width: 100, height: 100 },
        },
        companyLogoMarker,
      ],
    },
    Bagno: {
      image: 'bathroom.jpeg',
      markers: [
        {
          id: 'to-storeroom',
          position: { yaw: '10deg', pitch: '0deg' },
          tooltip: 'Vai in Ripostiglio',
          image: 'storeroom-preview.jpeg',
          data: { target: 'Ripostiglio' },
          size: { width: 100, height: 100 },
        },
        companyLogoMarker,
      ],
    },
  }

  const [currentRoom, setCurrentRoom] =
    React.useState<keyof typeof rooms>('Soggiorno')

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
      <h3 className="mb-1">{currentRoom}</h3>
      {currentRoom in roomDescription && (
        <p className="room-description mb-1">{roomDescription[currentRoom]}</p>
      )}
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

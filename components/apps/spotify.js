import React from 'react'

export default function Spotify() {
    return (
        <iframe src="https://open.spotify.com/embed/playlist/3r3RDx1kRSAQhkHQqEvc6G?utm_source=generator&theme=0" frameBorder="0" title="Spotify" className="h-full w-full bg-ub-cool-grey"></iframe>
    )
}

export const displaySpotify = () => {
    return <Spotify> </Spotify>;
}

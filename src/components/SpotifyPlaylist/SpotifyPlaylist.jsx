import './SpotifyPlaylist.css';

const SpotifyPlaylist = () => {
  return (
    <section className="spotify-section">
      <h2 className="section-title">
        <span className="title-line"></span>
        🎵 Nuestras Canciones
        <span className="title-line"></span>
      </h2>
      
      <div className="spotify-container">
        <div className="spotify-decoration left">💜</div>
        <div className="spotify-wrapper">
          <iframe 
            title="Nuestra Playlist"
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/playlist/62TxDxLuWEKeQ7aGL2bXE2?utm_source=generator&theme=0"
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
        <div className="spotify-decoration right">💜</div>
      </div>
      
      <p className="spotify-caption">
        Cada canción cuenta nuestra historia 💕
      </p>
    </section>
  );
};

export default SpotifyPlaylist;

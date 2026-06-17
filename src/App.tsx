import "./App.css";

function App() {
  return (
    <main className="app" aria-label="방콕 캠핑">
      <iframe
        className="game-frame"
        title="방콕 캠핑 미니게임"
        src={`${import.meta.env.BASE_URL}game.html`}
      />
    </main>
  );
}

export default App;

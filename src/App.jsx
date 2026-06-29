import "./App.css";

function App() {
  return (
    <>
      <header>
        <h1>Registro da Guilda</h1>
        <nav>
          <ul>
            <li>
              <span className="blocked">
                Fichas
                <small> Em breve</small>
              </span>
            </li>
            <li>
              <a href="#">Grimório</a>
            </li>
            <li>
              <span className="blocked">
                Bestiário
                <small> Em breve</small>
              </span>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <header>
          <div>
            <h2>Grimório</h2>
            <p className="subtitle">
              Consulte todas as magias catalogadas pela Ordem Arcana.
            </p>
          </div>
          <img src="src\assets\logo.svg" alt="Logo do site" />
        </header>
      </main>
      <footer>
        <p>
          "Textura Branca" por{" "}
          <a
            target="_blank"
            href="https://unsplash.com/pt-br/@marjan_blan?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          >
            Marjan Blan
          </a>{" "}
          na{" "}
          <a
            target="_blank"
            href="https://unsplash.com/pt-br/fotografias/tecido-branco-na-mesa-de-madeira-marrom-_kUxT8WkoeY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          >
            Unsplash
          </a>
        </p>
        <p>
          "Textura de Madeira" por{" "}
          <a
            target="_blank"
            href="https://unsplash.com/pt-br/@clevelandart?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          >
            The Cleveland Museum of Art
          </a>{" "}
          na{" "}
          <a
            target="_blank"
            href="https://unsplash.com/pt-br/fotografias/textura-de-veio-marrom-escuro-da-madeira-AD8nr59mr5c?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          >
            Unsplash
          </a>
        </p>
      </footer>
    </>
  );
}

export default App;

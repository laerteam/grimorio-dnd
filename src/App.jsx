import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [spells, setSpells] = useState(null);
  const [page, setPage] = useState(1); //setPage still to be used later

  useEffect(() => {
    async function getSpellList() {
      const PAGE_SIZE = 20;
      const spellList = await fetch(
        "https://www.dnd5eapi.co/api/2014/spells",
      ).then((res) => res.json());

      const start = (page - 1) * PAGE_SIZE;

      setSpells(await spellList.results.slice(start, start + PAGE_SIZE));
    }

    getSpellList();
  });

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
        <section className="spells">
          {spells ? (
            spells.map((element) => {
              return (
                <div className="spellCard" key={element.index}>
                  <h3>{element.name}</h3>
                </div>
              );
            })
          ) : (
            <p>Carregando...</p>
          )}
        </section>
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

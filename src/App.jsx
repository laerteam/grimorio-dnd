import { useState, useEffect } from "react";
import "./App.css";

function SpellHeader({ spell }) {
  return (
    <>
      <h3>{spell.name}</h3>
      <p className="subtitle">
        <strong>
          Level {spell.level} - {spell.school.name}
        </strong>
      </p>
    </>
  );
}

function SpellStats({ spell }) {
  return (
    <>
      <p>
        <strong>Range: </strong>
        {spell.range}
      </p>
      <p>
        <strong>Duration: </strong>
        {spell.concentration && "Concentration, "}
        {spell.duration}
      </p>
      <p>
        <strong>Casting Time: </strong>
        {spell.casting_time}
      </p>
      <p>
        <strong>Components: </strong>
        {spell.components.join(", ")}
      </p>
      {spell.material && (
        <p>
          <strong>Material: </strong>
          {spell.material}
        </p>
      )}
      <p>
        <strong>Classes: </strong>
        {spell.classes.map((el) => el.name).join(", ")}
        <strong> Subclasses: </strong>
        {spell.subclasses
          ? spell.subclasses.map((el) => el.name).join(", ")
          : ""}
      </p>
      {spell.ritual && (
        <p>
          <strong>Can Ritual •</strong>
        </p>
      )}
      {spell.dc && (
        <p>
          <strong>DC: </strong>
          {spell.dc.dc_type.name}
        </p>
      )}
    </>
  );
}

function getSpellScaling(spell) {
  if (spell.damage) {
    return Object.entries(
      spell.damage.damage_at_slot_level ??
        spell.damage.damage_at_character_level,
    );
  }

  if (spell.heal_at_slot_level) {
    return Object.entries(spell.heal_at_slot_level);
  }

  return [];
}

function SpellScaling({ spell }) {
  const scaling = getSpellScaling(spell);

  if (!scaling.length) return null;

  return (
    <div className={spell.damage ? "damageStats" : "healStats"}>
      {spell.damage && (
        <p>
          <strong>Damage Type: </strong>
          {spell.damage.damage_type.name}
        </p>
      )}
      <p>
        <strong>{spell.damage ? "Damage Per Level" : "Heal Per Level"}</strong>
      </p>
      <table>
        <thead>
          <tr>
            <th>
              {spell.damage
                ? spell.damage.damage_at_slot_level
                  ? "Slot Level"
                  : "Character Level"
                : "Slot Level"}
            </th>
            <th>{spell.damage ? "Damage" : "Heal"}</th>
          </tr>
        </thead>
        <tbody>
          {scaling.map(([level, value]) => (
            <tr key={level}>
              <td>{level}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  const [spells, setSpells] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedSpell, setSelectedSpell] = useState(null);

  useEffect(() => {
    async function getSpellList() {
      const prevPage = document.querySelector(".prevPage");
      const nextPage = document.querySelector(".nextPage");
      const spellsDocument = document.querySelector(".spellsDocument");
      spellsDocument.classList.add("leaving");

      const PAGE_SIZE = 20;
      const spellList = await fetch(
        "https://www.dnd5eapi.co/api/2014/spells",
      ).then((res) => res.json());

      const start = (page - 1) * PAGE_SIZE;

      const spellIndex = spellList.results.slice(start, start + PAGE_SIZE);

      if (page == 1) {
        prevPage.classList.add("hidden");
      } else {
        prevPage.classList.remove("hidden");
      }

      if (page * PAGE_SIZE >= spellList.count) {
        nextPage.classList.add("hidden");
      } else {
        nextPage.classList.remove("hidden");
      }

      const spellDetails = await Promise.all(
        spellIndex.map((el) => {
          const spell = fetch(
            `https://www.dnd5eapi.co/api/2014/spells/${el.index}`,
          ).then((res) => res.json());

          return spell;
        }),
      );

      spellsDocument.classList.remove("leaving");
      setSpells(spellDetails);
    }

    getSpellList();
  }, [page]);

  function openSpellInfo(spell) {
    setSelectedSpell(() => ({
      ...spell,
    }));
    const spellInfo = document.getElementById("spellInfo");
    spellInfo.showModal();
  }

  function closeSpellInfo() {
    const spellInfo = document.getElementById("spellInfo");
    spellInfo.close();
  }

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
        <div className="waiting">
          <p>Aguarde um momento</p>
        </div>
        <div className="spellsDocument leaving">
          <header>
            <div>
              <h2>Grimório</h2>
              <p className="subtitle">
                Consulte todas as magias catalogadas pela Ordem Arcana. (Ainda a
                ser traduzido para pt-BR)
              </p>
            </div>
            <img src="src\assets\logo.svg" alt="Logo do site" />
          </header>
          <nav
            className="spellsNav"
            aria-label="Paginação do catálogo de magias"
          >
            <button
              className="prevPage"
              onClick={() => setPage((prevPage) => prevPage - 1)}
            >
              <strong>◀ Prev</strong>
            </button>
            <button
              className="nextPage"
              onClick={() => setPage((prevPage) => prevPage + 1)}
            >
              <strong>Next ▶</strong>
            </button>
          </nav>
          <section className="spells">
            {spells &&
              spells.map((el) => {
                return (
                  <div className="spellCard" key={el.index}>
                    <h3>{el.name}</h3>
                    <p className="subtitle">
                      <strong>
                        Level {el.level} - {el.school.name}
                      </strong>
                    </p>
                    <p>
                      <strong>Range: </strong>
                      {el.range}
                    </p>
                    <p>
                      <strong>duration: </strong>
                      {el.duration}
                    </p>
                    <p>
                      <strong>Casting Time: </strong>
                      {el.casting_time}
                    </p>
                    <p>
                      <strong>Components: </strong>
                      {el.components.join(", ")}
                    </p>
                    <button onClick={() => openSpellInfo(el)}>Details ▼</button>
                  </div>
                );
              })}
          </section>
          <dialog id="spellInfo">
            {selectedSpell && (
              <>
                <SpellHeader spell={selectedSpell} />
                <div className="spellValues">
                  <SpellStats spell={selectedSpell} />
                  <SpellScaling spell={selectedSpell} />
                </div>
                <div className="spellDescription">
                  <p>
                    <strong>Description: </strong>
                    {selectedSpell.desc}
                  </p>{" "}
                  <br />
                  <p>{selectedSpell.higher_level}</p>
                </div>
                <button onClick={closeSpellInfo}>Close ▼</button>
              </>
            )}
          </dialog>
        </div>
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

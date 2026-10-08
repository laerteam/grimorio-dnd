import { useState, useEffect, useRef } from "react";
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
  if (spell.damage[0]) {
    return Object.entries(
      spell.damage[0].damage_at_slot_level ??
        spell.damage[0].damage_at_character_level,
    );
  }

  if (spell.heal_at_slot_level) {
    return Object.entries(spell.heal_at_slot_level);
  }

  return [];
}

function SpellScaling({ spell }) {
  const scaling = getSpellScaling(spell);
  const dmg = spell.damage[0]

  if (!scaling.length) return null;

  return (
    <div className={dmg ? "damageStats" : "healStats"}>
      {spell.dmg && (
        <p>
          <strong>Damage Type: </strong>
          {dmg.damage_type.name}
        </p>
      )}
      <p>
        <strong>{dmg ? "Damage Per Level" : "Heal Per Level"}</strong>
      </p>
      <table>
        <thead>
          <tr>
            <th>
              {dmg
                ? dmg.damage_at_slot_level
                  ? "Slot Level"
                  : "Character Level"
                : "Slot Level"}
            </th>
            <th>{dmg ? "Damage" : "Heal"}</th>
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

  const [schoolOpen, setSchoolOpen] = useState(false);
  const [levelOpen, setLevelOpen] = useState(false);

  const [reload, setReload] = useState(0);
  const [filters, setFilters] = useState({
    searchSpell: "",
    schools: [],
    levels: [],
  });
  const filtersRef = useRef({ searchSpell: "", schools: [], levels: [] });

  const levelList = Array.from({ length: 10 }, (_, i) => i);
  const schoolList = [
    "abjuration",
    "conjuration",
    "divination",
    "enchantment",
    "evocation",
    "illusion",
    "necromancy",
    "transmutation",
  ];

  useEffect(() => {
    async function getSpellList() {
      const prevPage = document.querySelector(".prevPage");
      const nextPage = document.querySelector(".nextPage");
      const spellsDocument = document.querySelector(".spellsDocument");
      spellsDocument.classList.add("leaving");

      const PAGE_SIZE = 20;
      const query = [
        filtersRef.current.schools.length &&
          `school=${filtersRef.current.schools.join("%2C")}`,
        filtersRef.current.levels.length &&
          `level=${filtersRef.current.levels.join("%2C")}`,
      ]
        .filter(Boolean)
        .join("&");

      const spellList = await fetch(
        `https://www.dnd5eapi.co/api/2014/spells${query ? `?${query}` : ""}`,
      )
        .then((res) => res.json())
        .then((res) => {
          if (!filtersRef.current.searchSpell.trim()) return res.results;

          return res.results.filter((el) =>
            el.name
              .toLowerCase()
              .includes(filtersRef.current.searchSpell.toLowerCase()),
          );
        });

      const start = (page - 1) * PAGE_SIZE;
      const spellCount = spellList.length;
      const spellIndex = spellList.slice(start, start + PAGE_SIZE);

      if (page == 1) {
        prevPage.classList.add("hidden");
      } else {
        prevPage.classList.remove("hidden");
      }

      if (page * PAGE_SIZE >= spellCount) {
        nextPage.classList.add("hidden");
      } else {
        nextPage.classList.remove("hidden");
      }

      const spellDetails = await Promise.all(
        spellIndex.map((el) => {
          const spell = fetch(
            `https://www.dnd5eapi.co/api/2014/spells/${el.index}?lang=pt-br`,
          ).then((res) => res.json());

          return spell;
        }),
      );

      spellsDocument.classList.remove("leaving");
      setSpells(spellDetails);
    }

    getSpellList();
  }, [page, reload]);

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

  function filtering() {
    const searchSpell = document.querySelector(".searchSpell");
    filtersRef.current = {
      ...filters,
      searchSpell: searchSpell.value,
    };
    if (page === 1) {
      setReload((prev) => prev + 1);
    } else {
      setPage(1);
    }
  }

  function toggleSchool(school) {
    if (filters.schools.includes(school)) {
      setFilters((prev) => ({
        ...prev,
        schools: prev.schools.filter((s) => s !== school),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        schools: [...prev.schools, school],
      }));
    }
  }

  function toggleLevel(level) {
    if (filters.levels.includes(level)) {
      setFilters((prev) => ({
        ...prev,
        levels: prev.levels.filter((s) => s !== level),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        levels: [...prev.levels, level],
      }));
    }
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
            <div className="navSearch">
              <input
                className="searchSpell"
                placeholder="Pesquisar"
                type="text"
              />
              <button id="searchFilter" onClick={filtering}>
                ⌕
              </button>
              <div className="filterOptions">
                <button onClick={() => setSchoolOpen(!schoolOpen)}>
                  Escola{" "}
                  {filters.schools.length !== 0
                    ? `(${filters.schools.length})`
                    : ""}{" "}
                  ▼
                </button>

                {schoolOpen && (
                  <div className="dropdown">
                    {schoolList.map((school) => (
                      <label key={school}>
                        <input
                          type="checkbox"
                          checked={filters.schools.includes(school)}
                          onChange={() => toggleSchool(school.toLowerCase())}
                        />
                        {school[0].toUpperCase() + school.slice(1)}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="filterOptions">
                <button onClick={() => setLevelOpen(!levelOpen)}>
                  Nível{" "}
                  {filters.levels.length !== 0
                    ? `(${filters.levels.length})`
                    : ""}{" "}
                  ▼
                </button>

                {levelOpen && (
                  <div className="dropdown">
                    {levelList.map((level) => (
                      <label key={level}>
                        <input
                          type="checkbox"
                          checked={filters.levels.includes(level)}
                          onChange={() => toggleLevel(level)}
                        />
                        {level === 0 ? "Truque" : `Nível ${level}`}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="navPages">
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
            </div>
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
